import type { CreateConfigValues } from "@paperclipai/adapter-utils";

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function buildKnowledgeRefinerConfig(values: CreateConfigValues): Record<string, unknown> {
  const config: Record<string, unknown> = {};

  if (values.cwd) config.cwd = asString(values.cwd, "");
  if (values.model) config.model = asString(values.model, "claude-3-5-sonnet-latest");
  if (values.promptTemplate) config.promptTemplate = asString(values.promptTemplate, "");

  config.timeoutSec = 300; // Fixed timeout for knowledge processing
  config.graceSec = 15; // Fixed grace period
  config.temperature = 0.1; // Fixed low temperature for factual accuracy
  config.maxTokens = 4096; // Fixed for knowledge processing

  return config;
}