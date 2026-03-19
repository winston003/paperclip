import type { RunProcessResult } from "@paperclipai/adapter-utils/server-utils";
import { parseJson, asString, asNumber, parseObject } from "@paperclipai/adapter-utils/server-utils";

export interface ParsedKnowledgeRefinerOutput {
  threadId: string | null;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cachedInputTokens?: number;
  } | null;
  costUsd: number | null;
  summary: string | null;
  isUnknownSessionError: boolean;
}

export function parseKnowledgeRefinerStreamJson(stdout: string): ParsedKnowledgeRefinerOutput {
  const result: ParsedKnowledgeRefinerOutput = {
    threadId: null,
    usage: null,
    costUsd: null,
    summary: null,
    isUnknownSessionError: false,
  };

  const lines = stdout.split("\n");
  for (const line of lines) {
    if (!line.trim()) continue;

    const parsed = parseJson(line) as Record<string, unknown>;
    if (!parsed) continue;

    // Handle thread ID events
    if (parsed.type === "thread_created" || parsed.type === "thread_resumed") {
      result.threadId = asString(parsed.threadId, "") || null;
    }

    // Handle usage events
    if (parsed.type === "usage") {
      result.usage = {
        inputTokens: asNumber(parsed.inputTokens, 0),
        outputTokens: asNumber(parsed.outputTokens, 0),
        cachedInputTokens: parsed.cachedInputTokens !== undefined ? asNumber(parsed.cachedInputTokens, 0) : undefined,
      };
      result.costUsd = parsed.costUsd !== undefined ? asNumber(parsed.costUsd, 0) : null;
    }

    // Handle final summary
    if (parsed.type === "result" && parsed.content) {
      result.summary = asString(parsed.content, "") || null;
    }

    // Handle unknown session error
    if (parsed.type === "error" && asString(parsed.code, "") === "UNKNOWN_THREAD") {
      result.isUnknownSessionError = true;
    }
  }

  return result;
}

export function isKnowledgeRefinerUnknownSessionError(stdout: string): boolean {
  return parseKnowledgeRefinerStreamJson(stdout).isUnknownSessionError;
}

export function describeKnowledgeRefinerFailure(proc: RunProcessResult): string {
  if (proc.timedOut) {
    return `KnowledgeRefiner execution timed out`;
  }

  if (proc.exitCode === 127) {
    return "Claude CLI not found. Please install Claude Code CLI first.";
  }

  const parsed = parseKnowledgeRefinerStreamJson(proc.stdout);
  if (parsed.isUnknownSessionError) {
    return "Unknown session ID - will retry with fresh session";
  }

  const errorLine = proc.stderr.split("\n").find(line => line.includes("error:") || line.includes("Error:"));
  if (errorLine) {
    return `KnowledgeRefiner execution failed: ${errorLine.trim()}`;
  }

  return `KnowledgeRefiner execution failed with exit code ${proc.exitCode} (signal: ${proc.signal})`;
}