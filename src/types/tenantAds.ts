// types/tenantAds.ts

export enum TenantAdPlacement {
  HEADER = "HEADER",
  FOOTER = "FOOTER",
  SIDEBAR = "SIDEBAR",
  HOME_HERO = "HOME_HERO",
  HOME_BELOW_HERO = "HOME_BELOW_HERO",
  CATEGORY_TOP = "CATEGORY_TOP",
  CATEGORY_BOTTOM = "CATEGORY_BOTTOM",
  SEARCH_TOP = "SEARCH_TOP",
  SEARCH_BOTTOM = "SEARCH_BOTTOM",
  BLOG_LIST_TOP = "BLOG_LIST_TOP",
  BLOG_LIST_BOTTOM = "BLOG_LIST_BOTTOM",
}

export enum TenantAdAppearance {
  FULL_WIDTH = "FULL_WIDTH",
  LEFT_ALIGNED = "LEFT_ALIGNED",
  RIGHT_ALIGNED = "RIGHT_ALIGNED",
  CENTERED = "CENTERED",
  POPUP = "POPUP",
  STICKY = "STICKY",
}

export interface TenantAdSetting {
  id: string;
  tenantId: string;
  placement: TenantAdPlacement;
  appearance: TenantAdAppearance;
  codeSnippet: string;
  isEnabled: boolean;
  priority: number;
  title?: string;
  description?: string;
  targetingRules?: {
    pageTypes?: string[];
    excludePageTypes?: string[];
    userRoles?: string[];
    deviceTypes?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantAdInput {
  tenantId: string; // "main" for main website, or actual tenant ID
  placement: TenantAdPlacement;
  appearance: TenantAdAppearance;
  codeSnippet: string;
  isEnabled?: boolean;
  priority?: number;
  title?: string;
  description?: string;
  targetingRules?: {
    pageTypes?: string[];
    excludePageTypes?: string[];
    userRoles?: string[];
    deviceTypes?: string[];
  };
}

export interface UpdateTenantAdInput {
  id: string;
  tenantId?: string; // "main" for main website, or actual tenant ID
  placement?: TenantAdPlacement;
  appearance?: TenantAdAppearance;
  codeSnippet?: string;
  isEnabled?: boolean;
  priority?: number;
  title?: string;
  description?: string;
  targetingRules?: {
    pageTypes?: string[];
    excludePageTypes?: string[];
    userRoles?: string[];
    deviceTypes?: string[];
  };
}

// Helper type for ads grouped by placement
export type TenantAdsByPlacement = Record<string, TenantAdSetting[]>;

// Page types for targeting
export type PageType = "home" | "category" | "search" | "blog" | "blog-list" | "about" | "contact";
