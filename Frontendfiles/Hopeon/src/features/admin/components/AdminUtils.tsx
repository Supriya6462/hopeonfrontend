import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

type IconLike = ComponentType<{ className?: string }>;

interface PageHeaderProps {
  label?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({
  label,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="space-y-1">
        {label ? (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
        ) : null}
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 self-start">{action}</div> : null}
    </div>
  );
}

interface RefreshButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function RefreshButton({
  onClick,
  disabled = false,
}: RefreshButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
      <RefreshCw
        className={`h-3.5 w-3.5 mr-2 ${disabled ? "animate-spin" : ""}`}
      />
      Refresh
    </Button>
  );
}

const STATUS_MAP: Record<string, string> = {
  pending: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  requested: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  under_review: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  approved: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-primary/10 text-primary border-primary/20",
  paid: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  revoked: "bg-muted text-muted-foreground border-border",
  verified: "bg-primary/10 text-primary border-primary/20",
  active: "bg-primary/10 text-primary border-primary/20",
  expired: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  admin: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  organizer: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  donor: "bg-chart-4/10 text-chart-4 border-chart-4/20",
};

interface StatusBadgeProps {
  status?: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const normalized = (status ?? "").toLowerCase();
  const styleClass =
    STATUS_MAP[normalized] ?? "bg-muted text-muted-foreground border-border";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${styleClass} ${className}`}
    >
      {normalized || "unknown"}
    </span>
  );
}

interface EmptyStateProps {
  icon?: IconLike;
  title?: string;
  description?: string;
}

export function EmptyState({
  icon: Icon,
  title = "Nothing here yet",
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 py-14 text-center">
      {Icon ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      ) : null}
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {description ? (
        <p className="text-xs text-muted-foreground/70 max-w-[280px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  isFetching?: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination({
  page,
  totalPages,
  isFetching,
  onPrev,
  onNext,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Card className="surface-card shadow-sm">
      <CardContent className="py-3 px-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Page <span className="font-semibold text-foreground">{page}</span> of{" "}
          <span className="font-semibold text-foreground">{totalPages}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isFetching}
            onClick={onPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || isFetching}
            onClick={onNext}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface FilterCardProps {
  children: ReactNode;
}

export function FilterCard({ children }: FilterCardProps) {
  return (
    <Card className="surface-card shadow-sm">
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

interface InfoRowProps {
  label: string;
  value?: ReactNode;
  className?: string;
}

export function InfoRow({ label, value, className = "" }: InfoRowProps) {
  return (
    <div className={className}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value ?? "-"}</p>
    </div>
  );
}

interface DetailSectionProps {
  icon?: IconLike;
  title: string;
  children: ReactNode;
}

export function DetailSection({
  icon: Icon,
  title,
  children,
}: DetailSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        {children}
      </div>
    </div>
  );
}
