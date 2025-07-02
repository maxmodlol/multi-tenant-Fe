/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@explore/components/ui/button";
import { useSiteSetting } from "@/src/hooks/public/useSetting";
import { useUploadLogo } from "@/src/hooks/dashboard/useUploadLogo";
import { SiteSetting } from "@/src/types/siteSetting";
import { useUpdateSiteSetting } from "@/src/hooks/dashboard/mutations/useSiteMutation";

const PRESET_COLORS = ["#4B5563", "#047857", "#1D4ED8", "#4F46E5", "#7C3AED", "#DB2777", "#EA580C"];

/**
 * A single reusable card row (label + description on the right, body on the left)
 */
function Row({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-12 gap-6 items-start py-6 first:pt-0 last:pb-0">
      <div className="col-span-12 md:col-span-4 text-sm">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-5">{description}</p>
      </div>
      <div className="col-span-12 md:col-span-8 flex flex-col md:flex-row md:items-center gap-4">
        {children}
      </div>
    </section>
  );
}

export default function AppearanceForm() {
  /* ────────────────────────────────────────────────────────── */
  /* 1) Fetch & upload hooks                                    */
  /* ────────────────────────────────────────────────────────── */
  const { data: setting, isLoading } = useSiteSetting();
  const updateMutation = useUpdateSiteSetting();
  const uploadLogoMutation = useUploadLogo();

  /* ────────────────────────────────────────────────────────── */
  /* 2) Local state                                             */
  /* ────────────────────────────────────────────────────────── */
  const [logoLightUrl, setLogoLightUrl] = useState<string | null>(null);
  const [logoDarkUrl, setLogoDarkUrl] = useState<string | null>(null);
  const [logoLightPreview, setLogoLightPreview] = useState<string | null>(null);
  const [logoDarkPreview, setLogoDarkPreview] = useState<string | null>(null);

  const [selectedColorHex, setSelectedColorHex] = useState<string>(PRESET_COLORS[0]);
  const [headerStyle, setHeaderStyle] = useState<"gradient" | "solid">("gradient");
  const [headerColorHex, setHeaderColorHex] = useState<string>("");

  const lightFileRef = useRef<HTMLInputElement>(null);
  const darkFileRef = useRef<HTMLInputElement>(null);

  /* ────────────────────────────────────────────────────────── */
  /* 3) Prefill from DB                                         */
  /* ────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!setting) return;

    setLogoLightUrl(setting.logoLightUrl ?? null);
    setLogoLightPreview(setting.logoLightUrl ?? null);
    setLogoDarkUrl(setting.logoDarkUrl ?? null);
    setLogoDarkPreview(setting.logoDarkUrl ?? null);

    const toHex = (hsl: string): string => {
      const [h, sP, lP] = hsl.split(" ");
      const hNum = parseFloat(h) / 360;
      const s = parseFloat(sP) / 100;
      const l = parseFloat(lP) / 100;
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
        r = hue2rgb(p, q, hNum + 1 / 3);
        g = hue2rgb(p, q, hNum);
        b = hue2rgb(p, q, hNum - 1 / 3);
      }
      const toHexCh = (x: number) =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, "0");
      return `#${toHexCh(r)}${toHexCh(g)}${toHexCh(b)}`;
    };

    const baseHex = toHex(setting.baseColor);
    setSelectedColorHex(baseHex);

    setHeaderStyle(setting.headerStyle);
    if (setting.headerStyle === "solid") {
      setHeaderColorHex(setting.headerColor ? toHex(setting.headerColor) : baseHex);
    } else {
      setHeaderColorHex("");
    }
  }, [setting]);

  /* ────────────────────────────────────────────────────────── */
  /* 4) Handlers                                                */
  /* ────────────────────────────────────────────────────────── */
  const handleLogoChange = (type: "light" | "dark") => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadLogoMutation.mutate(file, {
      onSuccess: (url) => {
        if (type === "light") {
          setLogoLightUrl(url);
          setLogoLightPreview(url);
        } else {
          setLogoDarkUrl(url);
          setLogoDarkPreview(url);
        }
      },
    });
  };

  const handleColorClick = (hex: string) => {
    if (headerStyle === "solid") setHeaderColorHex(hex);
    else setSelectedColorHex(hex);
  };

  const handleCustomColor = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^#([0-9A-Fa-f]{6})$/.test(val)) {
      headerStyle === "solid" ? setHeaderColorHex(val) : setSelectedColorHex(val);
    }
  };

  const hexToHslString = (hex: string): string => {
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
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  /* ────────────────────────────────────────────────────────── */
  /* 5) Submit                                                 */
  /* ────────────────────────────────────────────────────────── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!setting) return;

    const baseHsl = hexToHslString(selectedColorHex);
    const headerHsl =
      headerStyle === "solid" ? hexToHslString(headerColorHex || selectedColorHex) : null;

    const dto: SiteSetting = {
      ...setting,
      logoLightUrl: logoLightUrl ?? "",
      logoDarkUrl: logoDarkUrl ?? "",
      baseColor: baseHsl,
      headerStyle,
      headerColor: headerHsl,
    };

    await updateMutation.mutateAsync(dto);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400 animate-pulse">
        Loading appearance settings…
      </div>
    );
  }

  /* ────────────────────────────────────────────────────────── */
  /* 6) Render                                                 */
  /* ────────────────────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-10"
    >
      <h2 className="text-3xl font-semibold mb-10 text-center text-gray-900 dark:text-gray-100">
        Appearance Settings
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Logos -------------------------------------------------- */}
        <Row label="Light Logo" description="Shown on light backgrounds.">
          <LogoUploader
            previewUrl={logoLightPreview}
            fileRef={lightFileRef}
            placeholderBg="bg-gray-50 dark:bg-gray-700"
            onChange={handleLogoChange("light")}
            uploading={uploadLogoMutation.isPending}
            cta={logoLightPreview ? "Replace" : "Upload"}
          />
        </Row>

        <Row label="Dark Logo" description="Shown on dark backgrounds.">
          <LogoUploader
            previewUrl={logoDarkPreview}
            fileRef={darkFileRef}
            placeholderBg="bg-gray-800 dark:bg-gray-900"
            onChange={handleLogoChange("dark")}
            uploading={uploadLogoMutation.isPending}
            cta={logoDarkPreview ? "Replace" : "Upload"}
          />
        </Row>

        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        {/* Brand colour ------------------------------------------- */}
        <Row label="Brand Colour" description="Primary hue for your brand.">
          <div className="flex items-center gap-3 flex-wrap">
            {PRESET_COLORS.map((hex) => (
              <ColorSwatch
                key={hex}
                hex={hex}
                selected={selectedColorHex.toLowerCase() === hex.toLowerCase()}
                onClick={() => handleColorClick(hex)}
              />
            ))}
            <input
              type="color"
              value={selectedColorHex}
              onChange={handleCustomColor}
              className="h-9 w-9 rounded-full cursor-pointer border-none p-0"
            />
          </div>
        </Row>

        {/* Header style ------------------------------------------ */}
        <Row label="Header Style" description="Toggle between animated gradient or a solid bar.">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-6">
              {(["gradient", "solid"] as const).map((style) => (
                <label key={style} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={style}
                    checked={headerStyle === style}
                    onChange={() => setHeaderStyle(style)}
                  />
                  <span className="capitalize">{style}</span>
                </label>
              ))}
            </div>

            {headerStyle === "solid" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3 flex-wrap"
              >
                {PRESET_COLORS.map((hex) => (
                  <ColorSwatch
                    key={hex}
                    hex={hex}
                    selected={headerColorHex.toLowerCase() === hex.toLowerCase()}
                    onClick={() => setHeaderColorHex(hex)}
                  />
                ))}
                <input
                  type="color"
                  value={headerColorHex || selectedColorHex}
                  onChange={(e) => setHeaderColorHex(e.target.value)}
                  className="h-9 w-9 rounded-full cursor-pointer border-none p-0"
                />
              </motion.div>
            )}
          </div>
        </Row>

        {/* Action buttons ---------------------------------------- */}
        <div className="flex justify-end mt-10 gap-3">
          <Button variant="outline" size="sm" type="button">
            Cancel
          </Button>
          <Button size="sm" type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Reusable sub‑components
 * ───────────────────────────────────────────────────────────── */
function LogoUploader({
  previewUrl,
  placeholderBg,
  fileRef,
  onChange,
  uploading,
  cta,
}: {
  previewUrl: string | null;
  placeholderBg: string;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  cta: string;
}) {
  return (
    <div className="flex items-center gap-5 flex-wrap">
      <div
        className={`h-24 w-24 rounded-lg border overflow-hidden flex items-center justify-center ${placeholderBg}`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500">Preview</span>
        )}
      </div>

      <div className="relative">
        <Button variant="outline" size="sm" type="button">
          {uploading ? "Uploading…" : cta + " Logo"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

function ColorSwatch({
  hex,
  selected,
  onClick,
}: {
  hex: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{ scale: selected ? 1.15 : 1 }}
      className={`h-9 w-9 rounded-full border-2 transition shadow-sm focus:outline-none ${
        selected
          ? "ring-2 ring-offset-2 ring-gray-800 dark:ring-gray-200 border-white"
          : "border-transparent"
      }`}
      style={{ backgroundColor: hex }}
    />
  );
}
