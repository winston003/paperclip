import { printKnowledgeRefinerStreamEvent } from "./format-event.js";

export function formatStdoutEvent(line: string, debug: boolean): void {
  printKnowledgeRefinerStreamEvent(line, debug);
}