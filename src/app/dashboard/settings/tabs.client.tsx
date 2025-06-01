// app/(dashboard)/settings/tabs.client.tsx
"use client";

import { useState } from "react";
import { Button } from "@explore/components/ui/button";
import type { TabConfig } from "./settings-config";

// Import each tab’s form:
import AppearanceForm from "./appearance.client";
import UsersAndTeamsForm from "./users.client";
import AccountSettingsForm from "./account.client";
import AdsSettingsForm from "./ads.client";

interface SettingsTabsProps {
  tabs: TabConfig[];
}

export default function SettingsTabs({ tabs }: SettingsTabsProps) {
  // 1) if tabs is empty, show a message instead of crashing:
  if (!tabs.length) {
    return (
      <p className="p-6 text-center text-sm text-gray-500">
        You don’t have access to any settings.
      </p>
    );
  }

  // 2) otherwise render as before
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = tabs[activeIndex];

  return (
    <>
      {/* Tabs bar */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            onClick={() => setActiveIndex(i)}
            className={`
        text-sm font-medium px-4 py-2
        ${
          i === activeIndex
            ? "bg-white shadow-sm rounded-md text-gray-900"
            : "text-gray-600 hover:text-gray-900"
        }
      `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content pane */}
      <div className="rounded-lg border   border-gray-200 p-6">
        {activeTab.key === "appearance" && <AppearanceForm />}
        {activeTab.key === "users" && <UsersAndTeamsForm />}
        {activeTab.key === "account" && <AccountSettingsForm />}
        {activeTab.key === "ads" && <AdsSettingsForm />}
      </div>
    </>
  );
}
