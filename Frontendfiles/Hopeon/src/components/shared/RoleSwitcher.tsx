import { useNavigate } from "react-router-dom";
import { ChevronDown, Heart, Briefcase, Check } from "lucide-react";
import { useRoleContext, type ViewContext } from "@/context/RoleContext";
import { ROUTES } from "@/routes/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoleSwitcherProps {
  mobile?: boolean;
}

const viewOptions: {
  value: ViewContext;
  label: string;
  icon: typeof Heart;
  description: string;
}[] = [
  {
    value: "donor",
    label: "Donor",
    icon: Heart,
    description: "Browse & donate to campaigns",
  },
  {
    value: "organizer",
    label: "Organizer",
    icon: Briefcase,
    description: "Manage your campaigns",
  },
];

/**
 * RoleSwitcher - Dropdown component for switching between donor and organizer views
 * Only visible to users with organizer role
 */
export default function RoleSwitcher({ mobile = false }: RoleSwitcherProps) {
  const { activeView, setActiveView, canSwitchRole } = useRoleContext();
  const navigate = useNavigate();

  if (!canSwitchRole) return null;

  const currentView =
    viewOptions.find((v) => v.value === activeView) || viewOptions[0];
  const CurrentIcon = currentView.icon;

  const handleViewChange = (view: ViewContext) => {
    setActiveView(view);
    // Navigate to the appropriate dashboard with proper URL structure
    if (view === "organizer") {
      navigate(ROUTES.ORGANIZER_DASHBOARD);
    } else {
      navigate(ROUTES.HOME);
    }
  };

  if (mobile) {
    return (
      <div className="px-4 py-2">
        <p className="text-xs text-white/60 mb-2 font-medium uppercase tracking-wider">
          Switch View
        </p>
        <div className="flex gap-2">
          {viewOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeView === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleViewChange(option.value)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-white/20 text-white shadow-lg"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl gap-2 transition-all duration-300"
        >
          <CurrentIcon className="h-4 w-4 text-amber-300" />
          <span className="font-medium">{currentView.label}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-xl p-2"
      >
        <DropdownMenuLabel className="text-xs text-gray-500 font-medium uppercase tracking-wider px-2">
          Switch View
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-100" />
        {viewOptions.map((option) => {
          const Icon = option.icon;
          const isActive = activeView === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleViewChange(option.value)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "hover:bg-gray-50 text-gray-700",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg",
                  isActive ? "bg-emerald-100" : "bg-gray-100",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-emerald-600" : "text-gray-500",
                  )}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{option.label}</p>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
              {isActive && <Check className="h-4 w-4 text-emerald-600" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
