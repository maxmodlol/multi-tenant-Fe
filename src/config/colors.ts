export const DEFAULT_THEME = {
  primary: "#FEE4E2", // Background for header navigation
  secondary: "#535862", // Text color for buttons and navigation
  accent: "#E74C3C", // General accent color
  button: "#D84040", // 🔴 Correctly define the button/icon color
  border: "#E0E0E0",
  ring: "#3F51B5",
  background: "#FFFFFF",
  text: "#333333",
};

// Subdomain-specific themes
export const SUBDOMAIN_THEMES: Record<string, typeof DEFAULT_THEME> = {
  tenant1: {
    primary: "#FEE4E2", // Background for header navigation
    secondary: "#535862", // Text color for buttons and navigation
    accent: "#E74C3C", // General accent color
    button: "#D84040", // 🔴 Correctly define the button/icon color
    border: "#E0E0E0",
    ring: "#3F51B5",
    background: "#FFFFFF",
    text: "#333333", // Main text color
  },
  tenant2: {
    primary: "#FEE4E2", // Background for header navigation
    secondary: "#535862", // Text color for buttons and navigation
    accent: "#E74C3C", // General accent color
    button: "#D84040", // 🔴 Correctly define the button/icon color
    border: "#E0E0E0",
    ring: "#3F51B5",
    background: "#FFFFFF",
    text: "#333333",
  },
};
