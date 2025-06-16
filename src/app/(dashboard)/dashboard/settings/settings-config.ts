// settings-config.ts
export type Role = "ADMIN" | "PUBLISHER" | "EDITOR";

export interface TabConfig {
  key: string;
  label: string;
  allowedRoles: Role[];
}

export const SETTINGS_TABS: TabConfig[] = [
  { key: "appearance", label: "Appearance", allowedRoles: ["ADMIN", "PUBLISHER", "EDITOR"] },
  { key: "users", label: "Users & Team", allowedRoles: ["ADMIN"] },
  { key: "account", label: "Account settings", allowedRoles: ["ADMIN", "PUBLISHER"] },
  { key: "ads", label: "ADS settings", allowedRoles: ["ADMIN"] },
  { key: "header", label: "Header Ad", allowedRoles: ["ADMIN"] },
];
