import { useMemo } from "react";
import { Heart, Loader2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useRoleContext, type ViewContext } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes/routes";

interface RoleModeSwitcherProps {
  compact?: boolean;
}

const ROLES: {
  key: ViewContext;
  label: string;
  helper: string;
  icon: typeof Heart;
}[] = [
  {
    key: "donor",
    label: "Donor",
    helper: "Give and track donations",
    icon: Heart,
  },
  {
    key: "organizer",
    label: "Organizer",
    helper: "Create and manage campaigns",
    icon: UserRound,
  },
];

export default function RoleModeSwitcher({
  compact = false,
}: RoleModeSwitcherProps) {
  const { user } = useAuth();
  const { activeView, setActiveView, canSwitchRole } = useRoleContext();
  const navigate = useNavigate();

  const isSwitching = useMemo(() => false, []);

  if (!user || user.role !== "organizer" || !canSwitchRole) {
    return null;
  }

  const handleSwitch = (nextRole: ViewContext) => {
    if (nextRole === activeView) return;

    setActiveView(nextRole);
    if (nextRole === "organizer") {
      navigate(ROUTES.ORGANIZER_DASHBOARD);
    } else {
      navigate(ROUTES.DONOR_DASHBOARD);
    }

    toast.success(`Switched to ${nextRole} portal`);
  };

  return (
    <section
      className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-2"
      aria-label="Portal mode switcher"
    >
      {!compact ? (
        <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
          Switch portal
        </p>
      ) : null}

      <div className="space-y-1">
        {ROLES.map(({ key, label, helper, icon: Icon }) => {
          const isActive = activeView === key;

          return (
            <button
              key={key}
              type="button"
              className={[
                "flex w-full items-center gap-2 rounded-md px-2 transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                compact ? "h-9 justify-center" : "py-2",
                isActive
                  ? "bg-sidebar-primary/10 text-sidebar-primary font-semibold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              ].join(" ")}
              onClick={() => handleSwitch(key)}
              aria-pressed={isActive}
            >
              {isSwitching ? (
                <Loader2
                  className="h-4 w-4 shrink-0 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}

              {compact ? (
                <span className="sr-only">Switch to {label} portal</span>
              ) : (
                <span className="flex min-w-0 flex-col items-start">
                  <span className="text-sm font-medium leading-tight">
                    {label}
                  </span>
                  <span className="text-[11px] leading-tight text-sidebar-foreground/50">
                    {helper}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
