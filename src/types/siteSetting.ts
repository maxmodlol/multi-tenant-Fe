interface BrandScale {
  [level: string]: string; // e.g. "100": "216 56% 73%"
}
export interface SiteSetting {
  id: string;
  logoLightUrl?: string | null;
  logoDarkUrl?: string | null;
  baseColor: string; // "216 56% 45%"
  brandScale: BrandScale;
  headerStyle: "gradient" | "solid";
  headerColor?: string | null;
}
