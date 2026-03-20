import { Link } from "@/lib/router";
import { Identity } from "./Identity";
import { timeAgo } from "../lib/timeAgo";
import { cn } from "../lib/utils";
import { useTranslation } from "react-i18next";
import { deriveProjectUrlKey, type ActivityEvent, type Agent } from "@paperclipai/shared";

export function useActionVerbs() {
  const { t } = useTranslation();
  return {
    "issue.created": t("activity.issueCreated"),
    "issue.updated": t("activity.issueUpdated"),
    "issue.checked_out": t("activity.issueCheckedOut"),
    "issue.released": t("activity.issueReleased"),
    "issue.comment_added": t("activity.issueCommentAdded"),
    "issue.attachment_added": t("activity.issueAttachmentAdded"),
    "issue.attachment_removed": t("activity.issueAttachmentRemoved"),
    "issue.document_created": t("activity.issueDocumentCreated"),
    "issue.document_updated": t("activity.issueDocumentUpdated"),
    "issue.document_deleted": t("activity.issueDocumentDeleted"),
    "issue.commented": t("activity.issueCommented"),
    "issue.deleted": t("activity.issueDeleted"),
    "agent.created": t("activity.agentCreated"),
    "agent.updated": t("activity.agentUpdated"),
    "agent.paused": t("activity.agentPaused"),
    "agent.resumed": t("activity.agentResumed"),
    "agent.terminated": t("activity.agentTerminated"),
    "agent.key_created": t("activity.agentKeyCreated"),
    "agent.budget_updated": t("activity.agentBudgetUpdated"),
    "agent.runtime_session_reset": t("activity.agentSessionReset"),
    "heartbeat.invoked": t("activity.heartbeatInvoked"),
    "heartbeat.cancelled": t("activity.heartbeatCancelled"),
    "approval.created": t("activity.approvalRequested"),
    "approval.approved": t("activity.approvalApproved"),
    "approval.rejected": t("activity.approvalRejected"),
    "project.created": t("activity.projectCreated"),
    "project.updated": t("activity.projectUpdated"),
    "project.deleted": t("activity.projectDeleted"),
    "goal.created": t("activity.goalCreated"),
    "goal.updated": t("activity.goalUpdated"),
    "goal.deleted": t("activity.goalDeleted"),
    "cost.reported": t("activity.costReported"),
    "cost.recorded": t("activity.costRecorded"),
    "company.created": t("activity.companyCreated"),
    "company.updated": t("activity.companyUpdated"),
    "company.archived": t("activity.companyArchived"),
    "company.budget_updated": t("activity.companyBudgetUpdated"),
  };
}

function humanizeValue(value: unknown): string {
  if (typeof value !== "string") return String(value ?? "none");
  return value.replace(/_/g, " ");
}

function formatVerb(
  action: string,
  details: Record<string, unknown> | null | undefined,
  t: (key: string, options?: Record<string, unknown>) => string,
  actionVerbs: Record<string, string>
): string {
  if (action === "issue.updated" && details) {
    const previous = (details._previous ?? {}) as Record<string, unknown>;
    if (details.status !== undefined) {
      const from = previous.status;
      return from
        ? t("activity.changedStatusFromTo", { from: humanizeValue(from), to: humanizeValue(details.status) })
        : t("activity.changedStatusTo", { to: humanizeValue(details.status) });
    }
    if (details.priority !== undefined) {
      const from = previous.priority;
      return from
        ? t("activity.changedPriorityFromTo", { from: humanizeValue(from), to: humanizeValue(details.priority) })
        : t("activity.changedPriorityTo", { to: humanizeValue(details.priority) });
    }
  }
  return (actionVerbs as Record<string, string>)[action] ?? action.replace(/[._]/g, " ");
}

function entityLink(entityType: string, entityId: string, name?: string | null): string | null {
  switch (entityType) {
    case "issue": return `/issues/${name ?? entityId}`;
    case "agent": return `/agents/${entityId}`;
    case "project": return `/projects/${deriveProjectUrlKey(name, entityId)}`;
    case "goal": return `/goals/${entityId}`;
    case "approval": return `/approvals/${entityId}`;
    default: return null;
  }
}

interface ActivityRowProps {
  event: ActivityEvent;
  agentMap: Map<string, Agent>;
  entityNameMap: Map<string, string>;
  entityTitleMap?: Map<string, string>;
  className?: string;
}

export function ActivityRow({ event, agentMap, entityNameMap, entityTitleMap, className }: ActivityRowProps) {
  const { t } = useTranslation();
  const actionVerbs = useActionVerbs();
  const verb = formatVerb(event.action, event.details, t, actionVerbs);

  const isHeartbeatEvent = event.entityType === "heartbeat_run";
  const heartbeatAgentId = isHeartbeatEvent
    ? (event.details as Record<string, unknown> | null)?.agentId as string | undefined
    : undefined;

  const name = isHeartbeatEvent
    ? (heartbeatAgentId ? entityNameMap.get(`agent:${heartbeatAgentId}`) : null)
    : entityNameMap.get(`${event.entityType}:${event.entityId}`);

  const entityTitle = entityTitleMap?.get(`${event.entityType}:${event.entityId}`);

  const link = isHeartbeatEvent && heartbeatAgentId
    ? `/agents/${heartbeatAgentId}/runs/${event.entityId}`
    : entityLink(event.entityType, event.entityId, name);

  const actor = event.actorType === "agent" ? agentMap.get(event.actorId) : null;
  const actorName = actor?.name ?? (event.actorType === "system" ? t("activity.system") : event.actorType === "user" ? t("activity.board") : event.actorId || t("activity.unknown"));

  const inner = (
    <div className="flex gap-3">
      <p className="flex-1 min-w-0 truncate">
        <Identity
          name={actorName}
          size="xs"
          className="align-baseline"
        />
        <span className="text-muted-foreground ml-1">{verb} </span>
        {name && <span className="font-medium">{name}</span>}
        {entityTitle && <span className="text-muted-foreground ml-1">— {entityTitle}</span>}
      </p>
      <span className="text-xs text-muted-foreground shrink-0 pt-0.5">{timeAgo(event.createdAt)}</span>
    </div>
  );

  const classes = cn(
    "px-4 py-2 text-sm",
    link && "cursor-pointer hover:bg-accent/50 transition-colors",
    className,
  );

  if (link) {
    return (
      <Link to={link} className={cn(classes, "no-underline text-inherit block")}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={classes}>
      {inner}
    </div>
  );
}
