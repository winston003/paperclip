import type { UIAdapterModule } from "../types";
import { parseKnowledgeRefinerStdoutLine } from "../../../../packages/adapters/knowledge-refiner/src/ui/parse-stdout";
import { buildKnowledgeRefinerConfig } from "../../../../packages/adapters/knowledge-refiner/src/ui/build-config";
import { KnowledgeRefinerConfigFields } from "./config-fields";

export const knowledgeRefinerUIAdapter: UIAdapterModule = {
  type: "knowledge_refiner",
  label: "Knowledge Refiner",
  parseStdoutLine: parseKnowledgeRefinerStdoutLine,
  ConfigFields: KnowledgeRefinerConfigFields,
  buildAdapterConfig: buildKnowledgeRefinerConfig,
};