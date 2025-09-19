// settings-config.ts
export type Role = "ADMIN" | "PUBLISHER" | "EDITOR" | "ADMIN_HELPER";

export interface TabConfig {
  key: string;
  label: string;
  allowedRoles: Role[];
}

export const SETTINGS_TABS: TabConfig[] = [
  {
    key: "appearance",
    label: "Appearance",
    // Publisher should only see Appearance; Admin still allowed
    allowedRoles: ["ADMIN", "PUBLISHER"],
  },
  // Users & Team → Admin only
  { key: "users", label: "Users & Team", allowedRoles: ["ADMIN"] },
  // Account (password) → Editor and Admin Helper only (Admin also allowed)
  {
    key: "account",
    label: "Account settings",
    allowedRoles: ["ADMIN", "PUBLISHER", "EDITOR", "ADMIN_HELPER"],
  },
  // Unified Ads Management - Admin only
  { key: "ads", label: "Ads Management", allowedRoles: ["ADMIN"] },
  { key: "header", label: "Header Ads", allowedRoles: ["ADMIN"] },
];
