export const type = "knowledge_refiner";
export const label = "Knowledge Refiner (local)";

export const models = [
  { id: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet" },
  { id: "claude-3-opus-latest", label: "Claude 3 Opus" },
];

export const agentConfigurationDoc = `# knowledge_refiner agent configuration

Adapter: knowledge_refiner

Specialized agent for extracting, organizing, and refining knowledge content across AI, product, and business logic domains.

Use when:
- You need to process unstructured data (articles, videos, podcasts, discussions) to extract core ideas and actionable insights
- You need to build structured knowledge systems and knowledge graphs
- You need to improve content clarity, remove redundancy, and ensure accuracy
- You need to identify emerging trends, patterns, and hidden relationships across content sources
- You need to perform gap analysis and recommend content priorities

Don't use when:
- You need general-purpose code generation (use claude_local or codex_local instead)
- You need simple one-off question answering (use claude_local instead)
- The task requires heavy coding or system administration work

Core fields:
- cwd (string, required): absolute working directory for the agent process
- model (string, optional): model to use (defaults to claude-3-5-sonnet-latest)
- promptTemplate (string, optional): custom prompt template for the agent
- timeoutSec (number, optional): execution timeout in seconds (defaults to 300)
- graceSec (number, optional): graceful shutdown period in seconds (defaults to 15)

Core Mission:
Process raw information, extract actionable insights, build structured knowledge systems, and make complex content accessible and useful for the entire 龙虾梦工厂 ecosystem.

Core Competencies:
1. Content Extraction: Process unstructured data to extract core ideas, key arguments, and actionable insights
2. Knowledge Structuring: Organize information into hierarchical structures, build knowledge graphs
3. Quality Refinement: Improve content clarity, remove redundancy, ensure accuracy and consistency
4. Pattern Recognition: Identify emerging trends, common patterns, and hidden relationships
5. Gap Analysis: Detect knowledge gaps and recommend content priorities

Domain Focus:
- AI Technology: Machine learning, large language models, AI applications
- Product Management: Product strategy, user experience, product design, growth methodologies
- Business Logic: Business models, market analysis, revenue strategies, operational frameworks

Reporting: Reports directly to the CEO agent
`;