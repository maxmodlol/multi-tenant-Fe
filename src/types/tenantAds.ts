// types/tenantAds.ts

export enum TenantAdPlacement {
  // Site-wide placements (home, category, search pages)
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

  // Blog-specific placements (individual blog posts)
  ABOVE_TAGS = "ABOVE_TAGS",
  UNDER_DATE = "UNDER_DATE",
  UNDER_HERO = "UNDER_HERO",
  UNDER_HERO_IMAGE = "UNDER_HERO_IMAGE",
  ABOVE_SHAREABLE = "ABOVE_SHAREABLE",
  UNDER_SHAREABLE = "UNDER_SHAREABLE",
  INLINE = "INLINE",
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
  scope: string; // "main" = main domain only, "all" = all domains, or specific tenant ID
  blogId?: string; // Only used for blog-specific placements
  positionOffset?: number; // For INLINE placement: how many words before injecting
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
  scope: string; // "main" = main domain only, "all" = all domains, or specific tenant ID
  blogId?: string; // Only used for blog-specific placements
  positionOffset?: number; // For INLINE placement: how many words before injecting
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
  scope?: string; // "main" = main domain only, "all" = all domains, or specific tenant ID
  blogId?: string; // Only used for blog-specific placements
  positionOffset?: number; // For INLINE placement: how many words before injecting
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

// Scope options for ads
export enum AdScope {
  MAIN = "main", // Main domain only
  ALL = "all", // All domains (main + subdomains)
  // Specific tenant IDs are passed as strings
}

// Helper type for scope selection
export type AdScopeOption = AdScope.MAIN | AdScope.ALL | string; // string for specific tenant IDs
