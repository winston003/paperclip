import { useState } from "react";
import { ArrowUp, ArrowDown, Minus, AlertTriangle } from "lucide-react";
import { cn } from "../lib/utils";
import { priorityColor, priorityColorDefault } from "../lib/status-colors";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const priorityIcons: Record<string, typeof ArrowUp> = {
  critical: AlertTriangle,
  high: ArrowUp,
  medium: Minus,
  low: ArrowDown,
};

const allPriorities = ["critical", "high", "medium", "low"];

interface PriorityIconProps {
  priority: string;
  onChange?: (priority: string) => void;
  className?: string;
  showLabel?: boolean;
}

export function PriorityIcon({ priority, onChange, className, showLabel }: PriorityIconProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const Icon = priorityIcons[priority] ?? priorityIcons.medium;
  const colorClass = priorityColor[priority] ?? priorityColorDefault;

  const icon = (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        colorClass,
        onChange && !showLabel && "cursor-pointer",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </span>
  );

  const label = t(`priority.${priority}`, priority);

  if (!onChange) return showLabel ? <span className="inline-flex items-center gap-1.5">{icon}<span className="text-sm">{label}</span></span> : icon;

  const trigger = showLabel ? (
    <button className="inline-flex items-center gap-1.5 cursor-pointer hover:bg-accent/50 rounded px-1 -mx-1 py-0.5 transition-colors">
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  ) : icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-36 p-1" align="start">
        {allPriorities.map((p) => {
          const PIcon = priorityIcons[p];
          const pColorClass = priorityColor[p] ?? priorityColorDefault;
          const pLabel = t(`priority.${p}`, p);
          return (
            <Button
              key={p}
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2 text-xs", p === priority && "bg-accent")}
              onClick={() => {
                onChange(p);
                setOpen(false);
              }}
            >
              <PIcon className={cn("h-3.5 w-3.5", pColorClass)} />
              {pLabel}
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
