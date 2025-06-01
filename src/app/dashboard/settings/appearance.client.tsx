"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Button } from "@explore/components/ui/button";
import { Input } from "@explore/components/ui/input";
import { Popover } from "@explore/components/ui/popover";

const PRESET_COLORS = ["#4B5563", "#047857", "#1D4ED8", "#4F46E5", "#7C3AED", "#DB2777", "#EA580C"];

export default function AppearanceForm() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0]);
  const [customColor, setCustomColor] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  }

  function handleColorSelect(c: string) {
    setSelectedColor(c);
    setCustomColor("");
  }

  function handleCustomColor(e: ChangeEvent<HTMLInputElement>) {
    setCustomColor(e.target.value);
    setSelectedColor(e.target.value);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const form = new FormData();
    if (fileRef.current?.files?.[0]) form.append("logo", fileRef.current.files[0]);
    form.append("brandColor", selectedColor);

    await fetch("/api/settings/appearance", {
      method: "POST",
      body: form,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Logo */}
      <div className="grid grid-cols-3 gap-4 items-center ">
        <div>
          <h4 className="text-sm font-semibold">Company logo</h4>
          <p className="text-xs text-muted-foreground">Update your company logo.</p>
        </div>
        <div className="col-span-2 flex items-center space-x-4 ">
          <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden mx-2">
            {logoPreview ? (
              <img src={logoPreview} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                Logo
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden "
          />
          <label htmlFor="logo-upload">
            <Button variant="outline" size="sm">
              {logoPreview ? "Replace logo" : "Upload logo"}
            </Button>
          </label>
        </div>
      </div>
      <hr className="border-gray-200" />

      {/* Brand color */}
      <div className="grid grid-cols-3 gap-4 items-start">
        <div>
          <h4 className="text-sm font-semibold">Brand color</h4>
          <p className="text-xs text-muted-foreground">Select or customize your brand color.</p>
        </div>
        <div className="col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            {PRESET_COLORS.map((c, i) => (
              <button
                key={c}
                type="button"
                onClick={() => handleColorSelect(c)}
                className={`
                  h-8 w-8 rounded-full border-2
                  ${i === 0 ? "ml-3" : ""}                        /* first chip only */
                  ${selectedColor === c ? "border-brand-600" : "border-transparent"}
                `}
                style={{ backgroundColor: c }}
              />
            ))}

            {/* custom picker in a popover */}
            <Popover
              trigger={
                <button
                  type="button"
                  className={`h-8 w-8 rounded-full border-2 ${
                    !!customColor ? "border-red-600" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: customColor || "#ffffff" }}
                />
              }
              side="bottom"
            >
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={customColor || "#ffffff"}
                  onChange={handleCustomColor}
                  className="h-8 w-8 p-0 border-none"
                />
                <Input
                  value={customColor}
                  onChange={handleCustomColor}
                  placeholder="#rrggbb"
                  className="w-24"
                />
              </div>
            </Popover>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2  ">
        <Button variant="outline" size="sm" type="button">
          Cancel
        </Button>
        <Button size="sm" type="submit">
          Save changes
        </Button>
      </div>
    </form>
  );
}
