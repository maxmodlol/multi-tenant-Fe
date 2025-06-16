"use client";

import { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";
import { Button } from "@explore/components/ui/button";
import { Input } from "@explore/components/ui/input";
import { useSiteSetting } from "@/src/hooks/public/useSetting";
import { useUploadLogo } from "@/src/hooks/dashboard/useUploadLogo";
import { SiteSetting } from "@/src/types/siteSetting";
import { useUpdateSiteSetting } from "@/src/hooks/dashboard/mutations/useSiteMutation";

const PRESET_COLORS = ["#4B5563", "#047857", "#1D4ED8", "#4F46E5", "#7C3AED", "#DB2777", "#EA580C"];

export default function AppearanceForm() {
  // 1) Fetch current settings
  const { data: setting, isLoading } = useSiteSetting();
  const updateMutation = useUpdateSiteSetting();

  // 2) Upload hooks for logos
  const uploadLogoMutation = useUploadLogo();

  // 3) Local state for logo URLs & previews
  const [logoLightUrl, setLogoLightUrl] = useState<string | null>(null);
  const [logoDarkUrl, setLogoDarkUrl] = useState<string | null>(null);
  const [logoLightPreview, setLogoLightPreview] = useState<string | null>(null);
  const [logoDarkPreview, setLogoDarkPreview] = useState<string | null>(null);

  // 4) Local state for color (hex)
  const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0]);
  const [customColor, setCustomColor] = useState<string>("");

  // Refs to file inputs
  const lightFileRef = useRef<HTMLInputElement>(null);
  const darkFileRef = useRef<HTMLInputElement>(null);

  // 5) Prefill when `setting` arrives
  useEffect(() => {
    if (setting) {
      // a) Logos
      if (setting.logoLightUrl) {
        setLogoLightUrl(setting.logoLightUrl);
        setLogoLightPreview(setting.logoLightUrl);
      }
      if (setting.logoDarkUrl) {
        setLogoDarkUrl(setting.logoDarkUrl);
        setLogoDarkPreview(setting.logoDarkUrl);
      }

      // b) Convert stored baseColor (H S% L%) → hex
      const toHex = (hsl: string): string => {
        const parts = hsl.split(" ");
        if (parts.length !== 3) return PRESET_COLORS[0];
        const h = parseFloat(parts[0]) / 360;
        const s = parseFloat(parts[1].replace("%", "")) / 100;
        const l = parseFloat(parts[2].replace("%", "")) / 100;
        let r: number, g: number, b: number;
        if (s === 0) {
          r = g = b = l;
        } else {
          const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
        }
        const toHexCh = (x: number) =>
          Math.round(x * 255)
            .toString(16)
            .padStart(2, "0");
        return `#${toHexCh(r)}${toHexCh(g)}${toHexCh(b)}`;
      };

      const initialHex = toHex(setting.baseColor);
      setSelectedColor(initialHex);
      setCustomColor("");
    }
  }, [setting]);

  // 6) Handle light‐logo selection → immediate upload
  function handleLightLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadLogoMutation.mutate(file, {
      onSuccess(url) {
        setLogoLightUrl(url);
        setLogoLightPreview(url);
      },
      onError(err) {
        console.error("Light logo upload failed", err);
      },
    });
  }

  // 7) Handle dark‐logo selection → upload
  function handleDarkLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadLogoMutation.mutate(file, {
      onSuccess(url) {
        setLogoDarkUrl(url);
        setLogoDarkPreview(url);
      },
      onError(err) {
        console.error("Dark logo upload failed", err);
      },
    });
  }

  // 8) Color picker handlers
  function handleColorSelect(c: string) {
    setSelectedColor(c);
    setCustomColor("");
  }
  function handleCustomColor(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setCustomColor(val);
    if (/^#([0-9A-Fa-f]{6})$/.test(val)) {
      setSelectedColor(val);
    }
  }

  // 9) Convert hex → HSL string
  function hexToHslString(hex: string): string {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    const H = Math.round(h * 360);
    const S = Math.round(s * 100);
    const L = Math.round(l * 100);
    return `${H} ${S}% ${L}%`;
  }

  // 10) On form submit → send JSON to updateSiteSetting
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!setting) return;

    const hsl = hexToHslString(selectedColor);

    const dto: SiteSetting = {
      ...setting,
      logoLightUrl: logoLightUrl || "",
      logoDarkUrl: logoDarkUrl || "",
      baseColor: hsl,
    };

    await updateMutation.mutateAsync(dto);
    // Optionally: show a toast
  }

  // 11) Loading state
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading appearance settings…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Appearance Settings
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ===== LIGHT LOGO ===== */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Light Logo
            </label>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Upload the logo used on light backgrounds.
            </p>
          </div>
          <div className="col-span-2 flex items-center space-x-4">
            {/* Preview */}
            <div className="h-20 w-20 bg-gray-50 dark:bg-gray-700 rounded-md border overflow-hidden flex items-center justify-center">
              {logoLightPreview ? (
                <img
                  src={logoLightPreview}
                  alt="Light Logo Preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-gray-400 dark:text-gray-500">Preview</span>
              )}
            </div>

            {/* Button + overlay input */}
            <div className="relative">
              <Button variant="outline" size="sm" type="button">
                {logoLightPreview ? "Replace Light Logo" : "Upload Light Logo"}
              </Button>
              <input
                ref={lightFileRef}
                type="file"
                accept="image/*"
                onChange={handleLightLogoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Spinner if uploading */}
            {uploadLogoMutation.isPending && (
              <span className="text-gray-500 dark:text-gray-400 text-sm">Uploading…</span>
            )}
          </div>
        </div>

        {/* ===== DARK LOGO ===== */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dark Logo
            </label>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Upload the logo used on dark backgrounds.
            </p>
          </div>
          <div className="col-span-2 flex items-center space-x-4">
            {/* Preview */}
            <div className="h-20 w-20 bg-gray-800 dark:bg-gray-900 rounded-md border overflow-hidden flex items-center justify-center">
              {logoDarkPreview ? (
                <img
                  src={logoDarkPreview}
                  alt="Dark Logo Preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-gray-500 dark:text-gray-600">Preview</span>
              )}
            </div>

            {/* Button + overlay input */}
            <div className="relative">
              <Button variant="outline" size="sm" type="button">
                {logoDarkPreview ? "Replace Dark Logo" : "Upload Dark Logo"}
              </Button>
              <input
                ref={darkFileRef}
                type="file"
                accept="image/*"
                onChange={handleDarkLogoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {uploadLogoMutation.isPending && (
              <span className="text-gray-500 dark:text-gray-400 text-sm">Uploading…</span>
            )}
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* ===== BRAND COLOR ===== */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Brand Color
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Select or customize your primary brand color.
            </p>
          </div>
          <div className="col-span-2 space-y-4">
            {/* Preset Swatches + Color Input */}
            <div className="flex items-center space-x-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleColorSelect(c)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    selectedColor.toLowerCase() === c.toLowerCase()
                      ? "border-gray-900 dark:border-gray-100"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}

              {/* Always‐visible hex color input */}
              <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={handleCustomColor}
                  className="h-full w-full border-none p-0"
                />
              </div>
            </div>

            {/* Show current HSL value */}
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Current HSL: <span className="font-mono text-sm">{setting?.baseColor || "—"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" type="button">
            Cancel
          </Button>
          <Button size="sm" type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
