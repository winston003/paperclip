import type { AdapterEnvironmentTestContext, AdapterEnvironmentTestResult, AdapterEnvironmentCheckLevel } from "@paperclipai/adapter-utils";
import { asString, ensureAbsoluteDirectory, ensureCommandResolvable } from "@paperclipai/adapter-utils/server-utils";

export async function testEnvironment(ctx: AdapterEnvironmentTestContext): Promise<AdapterEnvironmentTestResult> {
  const { config } = ctx;
  const checks = [];
  let status: AdapterEnvironmentTestResult["status"] = "pass" as const;

  // Check cwd exists and is absolute
  const cwd = asString(config.cwd, "");
  try {
    await ensureAbsoluteDirectory(cwd);
    checks.push({
      code: "cwd_valid",
      level: "info" as AdapterEnvironmentCheckLevel,
      message: `Working directory is valid: ${cwd}`,
    });
  } catch (e) {
    status = "fail";
    checks.push({
      code: "cwd_invalid",
      level: "error" as AdapterEnvironmentCheckLevel,
      message: `Invalid working directory: ${cwd}`,
      detail: (e as Error).message,
      hint: "Provide an absolute path to an existing directory",
    });
  }

  // Check Claude CLI is installed
  const command = asString(config.command, "claude");
  try {
    await ensureCommandResolvable(command, cwd, process.env);
    checks.push({
      code: "cli_installed",
      level: "info" as AdapterEnvironmentCheckLevel,
      message: `Claude CLI is installed: ${command}`,
    });
  } catch (e) {
    status = "fail";
    checks.push({
      code: "cli_not_found",
      level: "error" as AdapterEnvironmentCheckLevel,
      message: `Claude CLI not found: ${command}`,
      detail: (e as Error).message,
      hint: "Install Claude Code CLI from https://anthropic.com/claude-code",
    });
  }

  // Check model is valid
  const model = asString(config.model, "claude-3-5-sonnet-latest");
  const validModels = ["claude-3-5-sonnet-latest", "claude-3-opus-latest"];
  if (validModels.includes(model)) {
    checks.push({
      code: "model_valid",
      level: "info" as AdapterEnvironmentCheckLevel,
      message: `Model is valid: ${model}`,
    });
  } else {
    status = "warn";
    checks.push({
      code: "model_unknown",
      level: "warn" as AdapterEnvironmentCheckLevel,
      message: `Unknown model: ${model}`,
      hint: `Supported models: ${validModels.join(", ")}`,
    });
  }

  return {
    adapterType: "knowledge_refiner",
    status,
    checks,
    testedAt: new Date().toISOString(),
  };
}