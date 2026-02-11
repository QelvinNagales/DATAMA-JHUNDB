import { cn } from "@/lib/utils";

type BadgeVariant = "active" | "returned" | "overdue" | "paid" | "unpaid" | "default";

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const styles: Record<BadgeVariant, string> = {
  active: "bg-info/10 text-info border-info/20",
  returned: "bg-success/10 text-success border-success/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
  paid: "bg-success/10 text-success border-success/20",
  unpaid: "bg-warning/10 text-warning border-warning/20",
  default: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        styles[variant]
      )}
    >
      {children}
    </span>
  );
}
