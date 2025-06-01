// app/(dashboard)/settings/ads.client.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@explore/components/ui/button";

type AdsAppearance = "left" | "popup" | "right";

interface Snippet {
  id: number;
  code: string;
}

const CARD_STYLES = {
  base: "flex-1 cursor-pointer rounded-lg border p-4",
  unchecked: "border-gray-300 bg-white",
  checked: "border-red-500 bg-red-50",
};

export default function AdsSettingsForm() {
  const [appearance, setAppearance] = useState<AdsAppearance>("left");
  const [snippets, setSnippets] = useState<Snippet[]>([
    { id: Date.now(), code: "// your ad code here\n" },
  ]);

  // Handle appearance change
  function handleAppearanceChange(val: AdsAppearance) {
    setAppearance(val);
  }

  // Add new empty snippet
  function handleAddSnippet() {
    setSnippets((prev) => [...prev, { id: Date.now(), code: "// new ad snippet\n" }]);
  }

  // Update snippet text
  function handleSnippetChange(id: number, e: ChangeEvent<HTMLTextAreaElement>) {
    setSnippets((prev) => prev.map((s) => (s.id === id ? { ...s, code: e.target.value } : s)));
  }

  // Remove a snippet
  function handleRemoveSnippet(id: number) {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  }

  // Submit form
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      appearance,
      snippets: snippets.map((s) => s.code),
    };
    await fetch("/api/settings/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // TODO: show success toast or refresh data
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ADS appearance */}
      <div className="flex items-start space-x-6">
        <div className="flex-shrink-0 w-48">
          <h3 className="text-sm font-medium text-gray-900">ADS appearance</h3>
          <p className="text-xs text-gray-500">Change how ADS appear to visitors.</p>
        </div>

        <div className="flex flex-1 gap-4">
          {[
            { key: "left", label: "Left aligned", desc: "Lorem ipsum description" },
            { key: "popup", label: "Pop up", desc: "Lorem ipsum description" },
            { key: "right", label: "Right aligned", desc: "Lorem ipsum description" },
          ].map((opt) => {
            const val = opt.key as AdsAppearance;
            const checked = appearance === val;
            return (
              <label
                key={val}
                className={`${CARD_STYLES.base} ${
                  checked ? CARD_STYLES.checked : CARD_STYLES.unchecked
                }`}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="adsAppearance"
                    value={val}
                    checked={checked}
                    onChange={() => handleAppearanceChange(val)}
                    className="h-4 w-4 text-red-600"
                  />
                  <span className="font-medium text-gray-900">{opt.label}</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">{opt.desc}</p>
              </label>
            );
          })}
        </div>
      </div>

      {/* Code snippets */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">ADS code snippets</h3>

        <div className="space-y-4">
          {snippets.map((s, idx) => (
            <div key={s.id} className="relative">
              <textarea
                value={s.code}
                onChange={(e) => handleSnippetChange(s.id, e)}
                className="w-full rounded-lg border bg-gray-50 font-mono p-4 text-sm leading-snug"
                rows={6}
              />
              {snippets.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSnippet(s.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={handleAddSnippet}
          className="mt-4"
        >
          + Add ADS
        </Button>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
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
