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
  // ADS and Header remain Admin only
  { key: "ads", label: "ADS settings", allowedRoles: ["ADMIN"] },
  { key: "header", label: "Header Ad", allowedRoles: ["ADMIN"] },
  // Tenant Ads - Admin only
  { key: "tenant-ads", label: "Tenant Ads", allowedRoles: ["ADMIN"] },
];
