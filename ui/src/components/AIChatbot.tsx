import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const SYSTEM_PROMPT = `You are Paperclip AI Assistant — a specialized expert for the Paperclip open-source AI agent control plane project.

Your purpose is to help users with:
- Configuration questions (company setup, agent creation, project setup, workspace settings)
- Troubleshooting common errors (build issues, TypeScript errors, database migrations, login problems)
- Explaining features (what is approval-based governance, what are isolated workspaces, how does budgeting work)
- How-to guides (adding a new agent, creating a project, configuring plugins)
- Navigation help (where to find certain settings)

Always be concise, practical, and directly answer the question. Paperclip is an open-source project that implements a complete control plane for running autonomous AI agent companies — think of it as GitHub but for AI agent organizations.

When users ask about errors, help them diagnose common issues:
- TypeScript errors that pre-date their changes: these are existing and unrelated to their edits
- JSON syntax errors: check for missing commas or extra closing brackets
- Git merge conflicts: help them resolve correctly
- Database migration issues: suggest checking migration history and running pnpm db:migrate

Stay friendly and helpful, don't be too technical unless they ask for technical details.
`;

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hello! I'm your Paperclip AI Assistant. Ask me anything about configuration, troubleshooting, or how to use any feature — I'm here to help!",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // In this MVP implementation, we'll use OpenRouter / OpenAI / Anthropic API
      // that's already configured in the instance. For now, we just demonstrate the UI.
      // In production, this would connect to the configured AI endpoint.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getExampleResponse(input),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantResponse]);
    } catch (error) {
      console.error("AI chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again or check your AI API configuration in instance settings.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  function getExampleResponse(question: string): string {
    // This is just a placeholder that demonstrates how it would work.
    // In production, this would be the streaming response from the configured LLM.
    const lower = question.toLowerCase();
    if (lower.includes("typescript") && lower.includes("error")) {
      return "It looks like you're seeing TypeScript errors. Could you check if these errors existed before your latest changes?\n\nIf the errors were already there, they're pre-existing and unrelated to your work. You can safely ignore them if they're in files you haven't touched.";
    }
    if (lower.includes("merge") && lower.includes("conflict")) {
      return "Merge conflicts happen when Git can't automatically merge changes. Look for files with <<<<<<< and >>>>>>> markers — you need to manually resolve these by editing the files to keep the correct version of each conflicting section.";
    }
    if (lower.includes("what is") && lower.includes("approval")) {
      return "Paperclip uses approval-based governance:\n\n- Critical changes (like hiring new agents, budget changes) require approval before they can execute\n- This provides a safety net so mistakes don't cause unexpected damage\n- You can configure who needs to approve what kinds of changes";
    }
    if (lower.includes("isolated") && lower.includes("workspace")) {
      return "Isolated workspaces mean each issue gets its own clean git worktree:\n\n- Every agent run gets a separate working directory\n- No cross-run contamination between simultaneous runs\n- Automatic cleanup when runs complete";
    }
    if (lower.includes("how do i") && lower.includes("create agent")) {
      return "You can create an agent a couple ways:\n\n1. **Quick create**: Go to Agents page → click \"New Agent\" → choose \"Ask CEO to create\" → the CEO agent will create it for you with proper setup\n\n2. **Advanced create**: Go to Agents page → click \"New Agent\" → \"I want advanced configuration myself\" → fill in the details step-by-step";
    }
    return "I understand you're asking about Paperclip. Could you be more specific about what you need help with? I'm happy to assist with any configuration or troubleshooting question!";
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6 text-primary-foreground" />
        </Button>
      </div>

      {/* Chat dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] p-0 flex flex-col">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle>📘 Paperclip AI Assistant</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Ask me anything about configuration, troubleshooting, or usage.
            </p>
          </DialogHeader>

          <ScrollArea ref={scrollRef} className="flex-1 px-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-full gap-2 py-2",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-[85%]",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center justify-start py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Paperclip configuration..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                className="min-h-[60px] flex-1 resize-none"
              />
              <Button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="shrink-0"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
