"use client";

import { useState } from "react";
import type { TabConfig } from "./settings-config";

// Shadcn “toggle‐group” components (single‐select)
import { ToggleGroup, ToggleGroupItem } from "@explore/components/ui/toggle-group";

import AppearanceForm from "./appearance.client";
import UsersAndTeamsForm from "./users.client";
import AccountSettingsForm from "./account.client";
import AdsSettingsForm from "./ads.client";
import HeaderSettingsForm from "./header.client";

interface SettingsTabsProps {
  tabs: TabConfig[];
}

export default function SettingsTabs({ tabs }: SettingsTabsProps) {
  // 1) If there are no tabs, show a friendly message
  if (!tabs.length) {
    return (
      <p className="p-6 text-center text-sm text-text-secondary">
        لا تملك صلاحية للوصول إلى الإعدادات.
      </p>
    );
  }

  // 2) Otherwise, initialize the first tab as “active”
  const [activeKey, setActiveKey] = useState<string>(tabs[0].key);

  // 3) Find the currently‐active tab’s config
  const activeTab = tabs.find((t) => t.key === activeKey)!;

  return (
    <div className="space-y-6">
      {/* — Tabs Bar — */}
      <ToggleGroup
        value={activeKey}
        onValueChange={(val) => val && setActiveKey(val)}
        className="
          inline-flex h-10 overflow-x-auto rounded-lg bg-background-secondary p-1
          scrollbar-thin scrollbar-thumb-background-tertiary scrollbar-track-transparent
        "
      >
        {tabs.map((tab) => (
          <ToggleGroupItem key={tab.key} value={tab.key}>
            {tab.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* — Content Container — */}
      <div className="rounded-lg border border-border-secondary bg-background-secondary p-6">
        {activeTab.key === "appearance" && <AppearanceForm />}
        {activeTab.key === "users" && <UsersAndTeamsForm />}
        {activeTab.key === "account" && <AccountSettingsForm />}
        {activeTab.key === "ads" && <AdsSettingsForm />}
        {activeKey === "header" && <HeaderSettingsForm />}
      </div>
    </div>
  );
}
