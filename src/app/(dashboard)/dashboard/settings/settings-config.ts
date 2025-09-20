// settings-config.ts
export type Role = "ADMIN" | "PUBLISHER" | "EDITOR" | "ADMIN_HELPER";

export interface TabConfig {
  key: string;
  label: string;
  icon?: string;
  description?: string;
  allowedRoles: Role[];
  badge?: string;
}

export const SETTINGS_TABS: TabConfig[] = [
  {
    key: "appearance",
    label: "Appearance",
    icon: "🎨",
    description: "Customize your dashboard theme and layout",
    // Publisher should only see Appearance; Admin still allowed
    allowedRoles: ["ADMIN", "PUBLISHER"],
  },
  // Users & Team → Admin only
  {
    key: "users",
    label: "Users & Team",
    icon: "👥",
    description: "Manage team members and permissions",
    allowedRoles: ["ADMIN"],
  },
  // Account (password) → Editor and Admin Helper only (Admin also allowed)
  {
    key: "account",
    label: "Account Settings",
    icon: "⚙️",
    description: "Update your profile and security settings",
    allowedRoles: ["ADMIN", "PUBLISHER", "EDITOR", "ADMIN_HELPER"],
  },
  // Unified Ads Management - Admin only
  {
    key: "ads",
    label: "Ads Management",
    icon: "📢",
    description: "Configure advertising across your platform",
    allowedRoles: ["ADMIN"],
  },
  {
    key: "header",
    label: "Header Ads",
    icon: "📋",
    description: "Manage header-specific advertisements",
    allowedRoles: ["ADMIN"],
  },
];
