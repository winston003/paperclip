import type {
  AdapterEnvironmentTestContext,
  AdapterEnvironmentTestResult,
  AdapterSessionCodec,
} from "@paperclipai/adapter-utils";
import { asString, parseObject, ensureAbsoluteDirectory, ensureCommandResolvable } from "@paperclipai/adapter-utils/server-utils";
import { execute } from "./execute.js";
import { testEnvironment } from "./test.js";
import { parseKnowledgeRefinerStreamJson, isKnowledgeRefinerUnknownSessionError } from "./parse.js";

export { execute, testEnvironment, parseKnowledgeRefinerStreamJson, isKnowledgeRefinerUnknownSessionError };

export const sessionCodec: AdapterSessionCodec = {
  deserialize(raw: unknown): Record<string, unknown> | null {
    const obj = parseObject(raw);
    if (!obj) return null;
    return {
      threadId: asString(obj.threadId, ""),
    };
  },

  serialize(params: Record<string, unknown> | null): Record<string, unknown> | null {
    if (!params) return null;
    return {
      threadId: asString(params.threadId, ""),
    };
  },

  getDisplayId(params: Record<string, unknown> | null): string | null {
    if (!params) return null;
    const threadId = asString(params.threadId, "");
    return threadId.length > 0 ? threadId : null;
  },
};