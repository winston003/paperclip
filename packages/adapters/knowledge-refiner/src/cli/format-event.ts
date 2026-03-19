import pc from "picocolors";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function printKnowledgeRefinerStreamEvent(raw: string, debug: boolean): void {
  const line = raw.trim();
  if (!line) return;

  const parsed = asRecord(safeJsonParse(line));
  if (!parsed) {
    if (debug) {
      console.log(pc.gray(line));
    }
    return;
  }

  const type = asString(parsed.type);

  switch (type) {
    case "thread_created":
      console.log(pc.blue(`📚 KnowledgeRefiner session started: ${asString(parsed.threadId)}`));
      break;
    case "thread_resumed":
      console.log(pc.blue(`📚 Resumed KnowledgeRefiner session: ${asString(parsed.threadId)}`));
      break;
    case "content_extraction":
      console.log(pc.green("\n📝 Extracting content:"));
      console.log(pc.white(asString(parsed.content)));
      break;
    case "knowledge_structuring":
      console.log(pc.cyan("\n🏗️  Structuring knowledge:"));
      console.log(pc.white(asString(parsed.content)));
      break;
    case "quality_refinement":
      console.log(pc.magenta("\n✨ Refining quality:"));
      console.log(pc.white(asString(parsed.content)));
      break;
    case "pattern_recognition":
      console.log(pc.yellow("\n🔍 Identifying patterns:"));
      console.log(pc.white(asString(parsed.content)));
      break;
    case "gap_analysis":
      console.log(pc.red("\n⚠️  Gap analysis:"));
      console.log(pc.white(asString(parsed.content)));
      break;
    case "result":
      console.log(pc.green("\n✅ Final Result:"));
      console.log(pc.white(asString(parsed.content)));
      if (parsed.usage) {
        const usage = asRecord(parsed.usage);
        if (usage) {
          const input = asString(usage.inputTokens);
          const output = asString(usage.outputTokens);
          const cost = asString(parsed.costUsd);
          console.log(pc.gray(`\nTokens: ${input} in, ${output} out | Cost: $${cost}`));
        }
      }
      break;
    case "error":
      console.log(pc.red(`\n❌ Error: ${asString(parsed.message)}`));
      break;
    default:
      if (debug) {
        console.log(pc.gray(line));
      }
  }
}