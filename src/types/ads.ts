// types/ads.ts

/** One Ad slot tied to a particular tenant + blog. */
export interface AdSetting {
  id: string;
  tenantId: string;
  blogId?: string;
  placement: Placement;
  appearance: Appearance;
  codeSnippet: string;
  isEnabled: boolean;
  positionOffset?: number;
  createdAt: string;
  updatedAt: string;
}

/** Possible placements in a blog page. */
export enum Placement {
  ABOVE_TAGS = "ABOVE_TAGS",
  UNDER_DATE = "UNDER_DATE",
  UNDER_SHARE_1 = "UNDER_SHARE_1",
  UNDER_SHARE_2 = "UNDER_SHARE_2",
  INLINE = "INLINE",
}

/** Visual appearance options for an ad. */
export enum Appearance {
  LEFT_ALIGNED = "LEFT_ALIGNED",
  RIGHT_ALIGNED = "RIGHT_ALIGNED",
  POPUP = "POPUP",
}

/** Payload to create a new AdSetting. */
// types/ads.ts

export interface CreateAdSettingInput {
  blogId: string;
  placement: Placement;
  appearance: Appearance;
  codeSnippet: string;
  isEnabled?: boolean;
  positionOffset?: number;
}

/** Payload to update an existing AdSetting. */
export interface UpdateAdSettingInput {
  id: string;
  placement?: Placement;
  appearance?: Appearance;
  codeSnippet?: string;
  isEnabled?: boolean;
  positionOffset?: number;
}

/** One global Header snippet (singleton) for Google Ads. */
export interface AdHeaderSetting {
  id: string;
  headerSnippet: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Payload to create/update the single header snippet. */
export interface UpsertAdHeaderInput {
  headerSnippet: string;
  isEnabled?: boolean;
}
