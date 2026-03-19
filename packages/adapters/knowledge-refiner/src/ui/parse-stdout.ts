import type { TranscriptEntry } from "@paperclipai/adapter-utils";

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

export function parseKnowledgeRefinerStdoutLine(line: string, ts: string): TranscriptEntry[] {
  const parsed = asRecord(safeJsonParse(line));
  if (!parsed) {
    return [{ kind: "stdout", ts, text: line }];
  }

  const type = asString(parsed.type);

  switch (type) {
    case "thread_created":
      return [
        {
          kind: "init",
          ts,
          model: asString(parsed.model),
          sessionId: asString(parsed.threadId),
        },
      ];
    case "thread_resumed":
      return [
        {
          kind: "system",
          ts,
          text: `Resumed knowledge processing session ${asString(parsed.threadId)}`,
        },
      ];
    case "thinking":
      return [
        {
          kind: "thinking",
          ts,
          text: asString(parsed.content),
        },
      ];
    case "content_extraction":
      return [
        {
          kind: "tool_result",
          ts,
          toolUseId: "content_extraction",
          content: asString(parsed.content),
          isError: false,
        },
      ];
    case "knowledge_structuring":
      return [
        {
          kind: "tool_result",
          ts,
          toolUseId: "knowledge_structuring",
          content: asString(parsed.content),
          isError: false,
        },
      ];
    case "quality_refinement":
      return [
        {
          kind: "tool_result",
          ts,
          toolUseId: "quality_refinement",
          content: asString(parsed.content),
          isError: false,
        },
      ];
    case "pattern_recognition":
      return [
        {
          kind: "tool_result",
          ts,
          toolUseId: "pattern_recognition",
          content: asString(parsed.content),
          isError: false,
        },
      ];
    case "gap_analysis":
      return [
        {
          kind: "tool_result",
          ts,
          toolUseId: "gap_analysis",
          content: asString(parsed.content),
          isError: false,
        },
      ];
    case "result":
      return [
        {
          kind: "result",
          ts,
          text: asString(parsed.content),
          inputTokens: typeof parsed.inputTokens === "number" ? parsed.inputTokens : 0,
          outputTokens: typeof parsed.outputTokens === "number" ? parsed.outputTokens : 0,
          cachedTokens: typeof parsed.cachedInputTokens === "number" ? parsed.cachedInputTokens : 0,
          costUsd: typeof parsed.costUsd === "number" ? parsed.costUsd : 0,
          subtype: "knowledge_refinement",
          isError: false,
          errors: [],
        },
      ];
    case "error":
      return [
        {
          kind: "result",
          ts,
          text: `Error: ${asString(parsed.message)}`,
          inputTokens: 0,
          outputTokens: 0,
          cachedTokens: 0,
          costUsd: 0,
          subtype: "error",
          isError: true,
          errors: [asString(parsed.message)],
        },
      ];
    default:
      return [{ kind: "stdout", ts, text: line }];
  }
}