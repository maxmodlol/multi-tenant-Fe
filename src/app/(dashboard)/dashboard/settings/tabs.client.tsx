"use client";

import { useState } from "react";
import type { TabConfig } from "./settings-config";

// Shadcn "toggle‐group" components (single‐select)
import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";

import AppearanceForm from "./appearance.client";
import UsersAndTeamsForm from "./users.client";
import AccountSettingsForm from "./account.client";
import UnifiedAdsClient from "./ads/UnifiedAdsClient";
import HeaderSettingsForm from "./header.client";

interface SettingsTabsProps {
  tabs: TabConfig[];
}

export default function SettingsTabs({ tabs }: SettingsTabsProps) {
  // 2) Initialize the first tab as "active" (moved before conditional return)
  const [activeKey, setActiveKey] = useState<string>(() => {
    if (typeof window === "undefined") return tabs[0]?.key || "";
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || tabs[0]?.key || "";
  });

  // 1) If there are no tabs, show a friendly message
  if (!tabs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 text-6xl opacity-50">🔒</div>
        <h3 className="mb-2 text-lg font-semibold text-text-primary">Access Restricted</h3>
        <p className="text-sm text-text-secondary">You don't have permission to access settings.</p>
      </div>
    );
  }

  // 3) Find the currently‐active tab's config
  const activeTab = tabs.find((t) => t.key === activeKey)!;

  return (
    <div className="space-y-8">
      {/* Enhanced Tabs Bar */}
      <div className="space-y-4">
        <ToggleGroup
          value={activeKey}
          onValueChange={(val) => val && setActiveKey(val)}
          className="w-full"
        >
          {tabs.map((tab) => (
            <ToggleGroupItem key={tab.key} value={tab.key} icon={tab.icon} badge={tab.badge}>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.icon}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {/* Tab Description */}
        {activeTab?.description && (
          <div className="flex items-center gap-3 px-2">
            <div className="text-2xl">{activeTab.icon}</div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{activeTab.label}</h2>
              <p className="text-sm text-text-secondary">{activeTab.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Content Container */}
      <div className="relative overflow-hidden rounded-2xl border border-border-secondary/60 bg-background-secondary/80 backdrop-blur-enhanced shadow-soft dark:shadow-soft-dark">
        {/* Content background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-brand-50/5 to-transparent dark:via-brand-950/10 pointer-events-none" />

        {/* Content */}
        <div className="relative tab-content-mobile">
          <div className="tab-enter tab-enter-active">
            {activeTab.key === "appearance" && <AppearanceForm />}
            {activeTab.key === "users" && <UsersAndTeamsForm />}
            {activeTab.key === "account" && <AccountSettingsForm />}
            {activeTab.key === "ads" && <UnifiedAdsClient />}
            {activeTab.key === "header" && <HeaderSettingsForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
