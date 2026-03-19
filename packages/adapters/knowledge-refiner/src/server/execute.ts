import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AdapterExecutionContext, AdapterExecutionResult } from "@paperclipai/adapter-utils";
import type { RunProcessResult } from "@paperclipai/adapter-utils/server-utils";
import {
  asString,
  asNumber,
  asBoolean,
  parseObject,
  parseJson,
  buildPaperclipEnv,
  redactEnvForLogs,
  ensureAbsoluteDirectory,
  ensureCommandResolvable,
  ensurePathInEnv,
  renderTemplate,
  runChildProcess,
} from "@paperclipai/adapter-utils/server-utils";
import {
  parseKnowledgeRefinerStreamJson,
  describeKnowledgeRefinerFailure,
  isKnowledgeRefinerUnknownSessionError,
} from "./parse.js";

const __moduleDir = path.dirname(fileURLToPath(import.meta.url));
const PAPERCLIP_SKILLS_CANDIDATES = [
  path.resolve(__moduleDir, "../../skills"),         // published: <pkg>/dist/server/ -> <pkg>/skills/
  path.resolve(__moduleDir, "../../../../../skills"), // dev: src/server/ -> repo root/skills/
];

async function resolvePaperclipSkillsDir(): Promise<string | null> {
  for (const candidate of PAPERCLIP_SKILLS_CANDIDATES) {
    const isDir = await fs.stat(candidate).then((s) => s.isDirectory()).catch(() => false);
    if (isDir) return candidate;
  }
  return null;
}

/**
 * Create a tmpdir with `.claude/skills/` containing symlinks to skills from
 * the repo's `skills/` directory, so `--add-dir` makes Claude Code discover
 * them as proper registered skills.
 */
async function buildSkillsDir(): Promise<string> {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "paperclip-skills-"));
  const target = path.join(tmp, ".claude", "skills");
  await fs.mkdir(target, { recursive: true });
  const skillsDir = await resolvePaperclipSkillsDir();
  if (!skillsDir) return tmp;
  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await fs.symlink(
        path.join(skillsDir, entry.name),
        path.join(target, entry.name),
      );
    }
  }
  return tmp;
}

interface KnowledgeRefinerExecutionInput {
  runId: string;
  agent: AdapterExecutionContext["agent"];
  runtime: AdapterExecutionContext["runtime"];
  config: Record<string, unknown>;
  context: Record<string, unknown>;
  authToken?: string;
  onLog: AdapterExecutionContext["onLog"];
  onMeta?: AdapterExecutionContext["onMeta"];
}

interface KnowledgeRefinerRuntimeConfig {
  command: string;
  cwd: string;
  env: Record<string, string>;
  timeoutSec: number;
  graceSec: number;
  extraArgs: string[];
}

async function buildRuntimeConfig(input: KnowledgeRefinerExecutionInput): Promise<KnowledgeRefinerRuntimeConfig> {
  const { agent, config } = input;

  const cwd = asString(config.cwd, process.cwd());
  await ensureAbsoluteDirectory(cwd);

  const command = asString(config.command, "claude");
  await ensureCommandResolvable(command, cwd, process.env);

  const baseEnv = buildPaperclipEnv(agent);
  const userEnv = parseObject(config.env) ?? {};

  const env: Record<string, string> = {
    ...process.env,
    ...baseEnv,
    ...userEnv,
    PAPERCLIP_AGENT_ROLE: "knowledge_refiner",
    PAPERCLIP_AGENT_DOMAIN: "knowledge,product,business",
  };

  if (input.authToken) {
    env.PAPERCLIP_API_KEY = input.authToken;
  }

  ensurePathInEnv(env);

  const timeoutSec = asNumber(config.timeoutSec, 300);
  const graceSec = asNumber(config.graceSec, 15);
  const model = asString(config.model, "claude-3-5-sonnet-latest");

  const extraArgs: string[] = [];

  // Knowledge Refiner specialized flags
  extraArgs.push("--model", model);
  extraArgs.push("--temperature", "0.1"); // Low temperature for factual accuracy
  extraArgs.push("--max-tokens", "4096"); // Longer output for knowledge processing

  // Add skills directory
  const skillsDir = await buildSkillsDir();
  extraArgs.push("--add-dir", skillsDir);

  // Session handling
  if (input.runtime.sessionParams?.threadId) {
    extraArgs.push("--thread-id", asString(input.runtime.sessionParams.threadId, ""));
  }

  return {
    command,
    cwd,
    env,
    timeoutSec,
    graceSec,
    extraArgs,
  };
}

const DEFAULT_PROMPT_TEMPLATE = `You are the KnowledgeRefiner, a specialist in extracting, organizing, and refining knowledge content across AI, product, and business logic domains.

## Core Mission
Your primary responsibility is to process raw information, extract actionable insights, build structured knowledge systems, and make complex content accessible and useful for the entire 龙虾梦工厂 ecosystem.

## Core Competencies
1. **Content Extraction**: Process unstructured data (articles, videos, podcasts, discussions) to extract core ideas, key arguments, and actionable insights
2. **Knowledge Structuring**: Organize information into hierarchical structures, build knowledge graphs, and create interconnected content frameworks
3. **Quality Refinement**: Improve content clarity, remove redundancy, ensure accuracy, and maintain consistency across knowledge assets
4. **Pattern Recognition**: Identify emerging trends, common patterns, and hidden relationships across diverse content sources
5. **Gap Analysis**: Detect knowledge gaps, identify areas requiring further research, and recommend content priorities

## Operating Principles
1. **Accuracy First**: Always verify facts, cite sources, and flag uncertain information for review
2. **Value Focus**: Prioritize extraction of actionable, high-impact insights over trivial details
3. **User-Centric**: Structure knowledge to be easily discoverable and usable by all platform users
4. **Continuous Improvement**: Regularly update and refine existing knowledge assets as new information becomes available
5. **Collaboration**: Work closely with content creators, domain experts, and other agents to ensure knowledge quality

## Domain Focus
- **AI Technology**: Machine learning, large language models, AI applications, technical implementation patterns
- **Product Management**: Product strategy, user experience, product design, growth methodologies
- **Business Logic**: Business models, market analysis, revenue strategies, operational frameworks

## Knowledge Output Standards
1. **6-Level Contribution Alignment**: All refined content must map to the platform's 6-level contribution hierarchy
2. **Structured Format**: Use consistent markdown formatting, clear headings, and standardized metadata
3. **Cross-Referencing**: Link related content, tag appropriately, and ensure discoverability via search
4. **Provenance Tracking**: Maintain source attribution, version history, and change logs for all knowledge assets

## Reporting
- Report directly to the CEO agent
- Provide weekly knowledge growth metrics and content quality reports
- Escalate complex domain questions to subject matter experts as needed

You are agent {{agent.id}} ({{agent.name}}). Continue your Paperclip work.

Current task:
{{context.taskDescription}}
`;

async function runAttempt(
  input: KnowledgeRefinerExecutionInput,
  runtimeConfig: KnowledgeRefinerRuntimeConfig,
  sessionId: string | null,
): Promise<RunProcessResult> {
  const { runId, agent, config, context, onLog, onMeta } = input;

  const promptTemplate = asString(config.promptTemplate, DEFAULT_PROMPT_TEMPLATE);
  const prompt = renderTemplate(promptTemplate, {
    agentId: agent.id,
    companyId: agent.companyId,
    runId,
    agent,
    context,
    taskDescription: asString(context.taskDescription, "Process the provided knowledge content and extract actionable insights."),
  });

  const args = [...runtimeConfig.extraArgs];

  if (sessionId) {
    args.push("--resume-thread", sessionId);
  }

  args.push("--prompt", prompt);

  if (onMeta) {
    await onMeta({
      adapterType: "knowledge_refiner",
      command: runtimeConfig.command,
      commandArgs: args,
      cwd: runtimeConfig.cwd,
      env: redactEnvForLogs(runtimeConfig.env),
    });
  }

  return runChildProcess(runId, runtimeConfig.command, args, {
    cwd: runtimeConfig.cwd,
    env: runtimeConfig.env,
    timeoutSec: runtimeConfig.timeoutSec,
    graceSec: runtimeConfig.graceSec,
    onLog,
  });
}

export async function execute(ctx: AdapterExecutionContext): Promise<AdapterExecutionResult> {
  const { runId, agent, runtime, config, context, authToken, onLog, onMeta } = ctx;

  const runtimeConfig = await buildRuntimeConfig({
    runId,
    agent,
    runtime,
    config,
    context,
    authToken,
    onLog,
    onMeta,
  });

  const runtimeSessionId = asString(runtime.sessionParams?.threadId, asString(runtime.sessionId, ""));
  const canResumeSession = runtimeSessionId.length > 0;
  const sessionId = canResumeSession ? runtimeSessionId : null;

  let proc = await runAttempt(ctx, runtimeConfig, sessionId);
  let clearSession = false;

  // If resume failed with unknown session, retry fresh
  if (sessionId && !proc.timedOut && proc.exitCode !== 0 && isKnowledgeRefinerUnknownSessionError(proc.stdout)) {
    clearSession = true;
    proc = await runAttempt(ctx, runtimeConfig, null);
  }

  const parsed = parseKnowledgeRefinerStreamJson(proc.stdout);

  const result: AdapterExecutionResult = {
    exitCode: proc.exitCode,
    signal: proc.signal,
    timedOut: proc.timedOut,
    usage: parsed.usage ?? undefined,
    sessionParams: parsed.threadId ? { threadId: parsed.threadId } : null,
    sessionDisplayId: parsed.threadId,
    provider: "anthropic",
    model: asString(config.model, "claude-3-5-sonnet-latest"),
    costUsd: parsed.costUsd,
    resultJson: {
      rawStdout: proc.stdout,
      rawStderr: proc.stderr,
      parsedOutput: parsed,
    },
    summary: parsed.summary,
    clearSession,
  };

  if (proc.exitCode !== 0 && !proc.timedOut) {
    result.errorMessage = describeKnowledgeRefinerFailure(proc);
  }

  return result;
}