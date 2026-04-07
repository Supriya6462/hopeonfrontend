import {
  ClipboardList,
  FolderKanban,
  HandCoins,
  Heart,
  Home,
  Info,
  LayoutDashboard,
  Shield,
  Users,
  Wallet,
} from "lucide-react";
import { ROUTES } from "@/routes/routes";

type NavItem = {
  label: string;
  to: string;
  icon: typeof Home;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const ADMIN_SECTIONS: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
      { label: "Campaigns", to: ROUTES.ADMIN_CAMPAIGNS, icon: FolderKanban },
      {
        label: "Applications",
        to: ROUTES.ADMIN_APPLICATIONS,
        icon: ClipboardList,
      },
      { label: "Withdrawals", to: ROUTES.ADMIN_WITHDRAWALS, icon: Wallet },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Users", to: ROUTES.ADMIN_USERS, icon: Users },
      { label: "Organizers", to: ROUTES.ADMIN_ORGANIZERS, icon: Shield },
      { label: "Donations", to: ROUTES.ADMIN_DONATIONS, icon: HandCoins },
    ],
  },
];

const ORGANIZER_SECTIONS: NavSection[] = [
  {
    title: "Workspace",
    items: [
      {
        label: "Dashboard",
        to: ROUTES.ORGANIZER_DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        label: "My Campaigns",
        to: ROUTES.ORGANIZER_CAMPAIGNS,
        icon: FolderKanban,
      },
      {
        label: "Create Campaign",
        to: ROUTES.ORGANIZER_CREATE_CAMPAIGN,
        icon: Heart,
      },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", to: ROUTES.ORGANIZER_PROFILE, icon: Shield },
      { label: "Withdrawals", to: ROUTES.ORGANIZER_WITHDRAWALS, icon: Wallet },
    ],
  },
];

export function getRoleHomePath(role?: "donor" | "organizer" | "admin") {
  if (role === "admin") return ROUTES.ADMIN_DASHBOARD;
  if (role === "organizer") return ROUTES.ORGANIZER_DASHBOARD;
  if (role === "donor") return ROUTES.DONOR_DASHBOARD;
  return ROUTES.HOME;
}

export function getSidebarItems(role: "admin" | "organizer") {
  const sections = role === "admin" ? ADMIN_SECTIONS : ORGANIZER_SECTIONS;
  return sections.flatMap((section) => section.items);
}

export function getSidebarSections(role: "admin" | "organizer") {
  return role === "admin" ? ADMIN_SECTIONS : ORGANIZER_SECTIONS;
}

export function getTopNavItems(
  user: {
    role: "donor" | "organizer" | "admin";
    isOrganizerApproved?: boolean;
  } | null,
) {
  const base: NavItem[] = [
    { label: "Home", to: ROUTES.HOME, icon: Home },
    { label: "About", to: ROUTES.ABOUTUS, icon: Info },
    { label: "Donate", to: ROUTES.CAMPAIGNS, icon: Heart },
  ];

  if (!user) return base;

  if (user.role === "donor") {
    const donorItems: NavItem[] = [
      ...base,
      { label: "Dashboard", to: ROUTES.DONOR_DASHBOARD, icon: LayoutDashboard },
      { label: "My Donations", to: ROUTES.DONOR_DONATIONS, icon: HandCoins },
    ];

    if (!user.isOrganizerApproved) {
      donorItems.push({
        label: "Apply Organizer",
        to: ROUTES.APPLY_ORGANIZER,
        icon: ClipboardList,
      });
    }

    return donorItems;
  }

  if (user.role === "organizer") {
    return [
      {
        label: "Dashboard",
        to: ROUTES.ORGANIZER_DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        label: "My Campaigns",
        to: ROUTES.ORGANIZER_CAMPAIGNS,
        icon: FolderKanban,
      },
      { label: "Withdrawals", to: ROUTES.ORGANIZER_WITHDRAWALS, icon: Wallet },
      { label: "Profile", to: ROUTES.ORGANIZER_PROFILE, icon: Shield },
    ];
  }

  return [
    { label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    { label: "Users", to: ROUTES.ADMIN_USERS, icon: Users },
  ];
}
