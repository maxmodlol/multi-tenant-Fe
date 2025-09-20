"use client";

import React, { useState, useMemo } from "react";
import { useTenantAds } from "@/src/hooks/dashboard/useTenantAds";
import { useTenantAdMutations } from "@/src/hooks/dashboard/mutations/useTenantAdMutations";
import { useTenants } from "@/src/hooks/dashboard/useTenants";
import { TenantAdPlacement, TenantAdAppearance, AdScope } from "@/src/types/tenantAds";
import type { TenantAdSetting, CreateTenantAdInput } from "@/src/types/tenantAds";

export default function UnifiedAdsClient() {
  console.log("🚀 UnifiedAdsClient: Component mounted!");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAd, setDeletingAd] = useState<TenantAdSetting | null>(null);
  const [editingAd, setEditingAd] = useState<TenantAdSetting | null>(null);
  const [formData, setFormData] = useState<CreateTenantAdInput>({
    tenantId: "main",
    placement: TenantAdPlacement.HEADER,
    appearance: TenantAdAppearance.FULL_WIDTH,
    codeSnippet: "",
    isEnabled: true,
    priority: 0,
    title: "",
    description: "",
    scope: AdScope.GLOBAL,
    blogId: undefined,
    positionOffset: undefined,
  });

  // Add page type selection
  const [selectedPageType, setSelectedPageType] = useState<"all" | "home" | "blog">("all");
  const [formPageType, setFormPageType] = useState<"home" | "blog">("home");

  // Add filtering state
  const [statusFilter, setStatusFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [placementFilter, setPlacementFilter] = useState<string>("all");
  const [scopeFilter, setScopeFilter] = useState<string>("all");

  // Fetch data
  const { data: tenantAds, isLoading: loadingAds, error: errorAds } = useTenantAds();
  const { data: tenants, isLoading: loadingTenants, error: errorTenants } = useTenants();

  // Get mutation hooks
  const { createMutation, updateMutation, deleteMutation } = useTenantAdMutations();

  // Create tenant options for scope selection
  const tenantOptions = useMemo(() => {
    const options = [
      { id: "main", name: "Main Domain Only", subdomain: "main" },
      { id: "all", name: "All Domains (Global)", subdomain: "all" },
    ];

    if (tenants) {
      tenants.forEach((tenant) => {
        options.push({
          id: String(tenant.id),
          name: `Tenant (${tenant.domain})`,
          subdomain: tenant.domain,
        });
      });
    }

    return options;
  }, [tenants]);

  // Group ads by scope for better organization
  const adsByScope = useMemo(() => {
    if (!tenantAds) return {};

    return tenantAds.reduce(
      (acc, ad) => {
        // Normalize scope - treat legacy "all" as "global"
        let scopeKey = ad.scope || "main";
        if (scopeKey === "all") {
          scopeKey = "global";
        }

        if (!acc[scopeKey]) {
          acc[scopeKey] = [];
        }
        acc[scopeKey].push(ad);
        return acc;
      },
      {} as Record<string, TenantAdSetting[]>,
    );
  }, [tenantAds]);

  // Filter ads based on current filters
  const filteredAds = useMemo(() => {
    if (!tenantAds) return [];

    return tenantAds.filter((ad) => {
      // Page type filter
      const isHomePlacement = [
        TenantAdPlacement.HEADER,
        TenantAdPlacement.FOOTER,
        TenantAdPlacement.SIDEBAR,
        TenantAdPlacement.HOME_HERO,
        TenantAdPlacement.HOME_BELOW_HERO,
        TenantAdPlacement.CATEGORY_TOP,
        TenantAdPlacement.CATEGORY_BOTTOM,
        TenantAdPlacement.SEARCH_TOP,
        TenantAdPlacement.SEARCH_BOTTOM,
        TenantAdPlacement.BLOG_LIST_TOP,
        TenantAdPlacement.BLOG_LIST_BOTTOM,
      ].includes(ad.placement);

      const isBlogPlacement = [
        TenantAdPlacement.ABOVE_TAGS,
        TenantAdPlacement.UNDER_DATE,
        TenantAdPlacement.UNDER_HERO,
        TenantAdPlacement.ABOVE_SHAREABLE,
        TenantAdPlacement.UNDER_SHAREABLE,
        TenantAdPlacement.INLINE,
      ].includes(ad.placement);

      if (selectedPageType === "home" && !isHomePlacement) return false;
      if (selectedPageType === "blog" && !isBlogPlacement) return false;
      // If selectedPageType === "all", no filtering by page type

      // Status filter
      if (statusFilter !== "all") {
        const isEnabled = ad.isEnabled;
        if (statusFilter === "enabled" && !isEnabled) return false;
        if (statusFilter === "disabled" && isEnabled) return false;
      }

      // Placement filter
      if (placementFilter !== "all") {
        if (ad.placement !== placementFilter) return false;
      }

      // Scope filter
      if (scopeFilter !== "all") {
        if (scopeFilter === AdScope.GLOBAL) {
          // For Global scope, include both "global" and legacy "all" scopes
          if (ad.scope !== AdScope.GLOBAL && ad.scope !== "all") return false;
        } else {
          if (ad.scope !== scopeFilter) return false;
        }
      }

      return true;
    });
  }, [tenantAds, selectedPageType, statusFilter, placementFilter, scopeFilter]);

  // Define placements based on page type
  const homePlacements = [
    TenantAdPlacement.HEADER,
    TenantAdPlacement.FOOTER,
    TenantAdPlacement.HOME_HERO,
    TenantAdPlacement.HOME_BELOW_HERO,
  ];

  const blogPlacements = [
    TenantAdPlacement.ABOVE_TAGS,
    TenantAdPlacement.UNDER_DATE,
    TenantAdPlacement.UNDER_HERO,
    TenantAdPlacement.ABOVE_SHAREABLE,
    TenantAdPlacement.UNDER_SHAREABLE,
    TenantAdPlacement.INLINE,
  ];

  // Get current placements based on selected page type for filtering
  const currentPlacements = useMemo(() => {
    if (selectedPageType === "home") return homePlacements;
    if (selectedPageType === "blog") return blogPlacements;
    // If "all" is selected, show all placements
    return [...homePlacements, ...blogPlacements];
  }, [selectedPageType]);

  // Get form placements (for form only)
  const formPlacements = formPageType === "home" ? homePlacements : blogPlacements;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAd) {
        await updateMutation.mutateAsync({
          id: editingAd.id,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }

      setIsCreateModalOpen(false);
      setEditingAd(null);
      setFormPageType("home");
      setFormData({
        tenantId: "main",
        placement: TenantAdPlacement.HEADER,
        appearance: TenantAdAppearance.FULL_WIDTH,
        codeSnippet: "",
        isEnabled: true,
        priority: 0,
        title: "",
        description: "",
        scope: AdScope.GLOBAL,
        blogId: undefined,
        positionOffset: undefined,
      });
    } catch (error) {
      console.error("Error saving ad:", error);
    }
  };

  // Handle edit
  const handleEdit = (ad: TenantAdSetting) => {
    setEditingAd(ad);
    // Determine page type based on placement
    const isBlogPlacement = blogPlacements.includes(ad.placement);
    setFormPageType(isBlogPlacement ? "blog" : "home");
    setFormData({
      tenantId: ad.tenantId,
      placement: ad.placement,
      appearance: ad.appearance,
      codeSnippet: ad.codeSnippet,
      isEnabled: ad.isEnabled,
      priority: ad.priority,
      title: ad.title || "",
      description: ad.description || "",
      scope: ad.scope || AdScope.GLOBAL,
      blogId: ad.blogId,
      positionOffset: ad.positionOffset,
    });
    setIsCreateModalOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingAd) return;

    try {
      await deleteMutation.mutateAsync(deletingAd.id);
      setIsDeleteModalOpen(false);
      setDeletingAd(null);
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  };

  // Handle toggle enabled status
  const handleToggleEnabled = async (ad: TenantAdSetting) => {
    try {
      await updateMutation.mutateAsync({
        id: ad.id,
        isEnabled: !ad.isEnabled,
      });
    } catch (error) {
      console.error("Error toggling ad status:", error);
    }
  };

  if (loadingAds || loadingTenants) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading ads configuration...</p>
        </div>
      </div>
    );
  }

  if (errorAds || errorTenants) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Error Loading Data</h3>
          <p className="text-text-secondary">Failed to load ads configuration. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-2">
            🎯 Ads Management
          </h1>
          <p className="text-sm sm:text-base text-text-secondary">
            Manage ads across your entire platform with unified controls
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <button
            onClick={() => {
              setEditingAd(null);
              setFormData({
                tenantId: "main",
                placement: formPlacements[0],
                appearance: TenantAdAppearance.FULL_WIDTH,
                codeSnippet: "",
                isEnabled: true,
                priority: 0,
                title: "",
                description: "",
                scope: AdScope.GLOBAL,
                blogId: undefined,
                positionOffset: undefined,
              });
              setIsCreateModalOpen(true);
            }}
            className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-lg">➕</span>
            <span className="hidden sm:inline">Create New Ad</span>
            <span className="sm:hidden">New Ad</span>
          </button>
        </div>
      </div>

      {/* Unified Filtering Section - Responsive */}
      <div className="bg-background-secondary rounded-xl p-3 sm:p-4 lg:p-6 border border-border-secondary shadow-lg">
        <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
          <span className="text-primary">🔍</span>
          Filters & Controls
        </h3>

        {/* Page Type Toggle - Responsive */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-text-primary mb-2 sm:mb-3">
            Page Type
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedPageType("all")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedPageType === "all"
                  ? "bg-primary text-white shadow-lg border-2 border-primary"
                  : "bg-background-primary text-text-secondary hover:bg-background-tertiary hover:text-text-primary border border-border-secondary"
              }`}
            >
              <span className="text-sm sm:text-base">🌐</span>
              <span>All</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  selectedPageType === "all"
                    ? "bg-white/20 text-white"
                    : "bg-background-secondary text-text-secondary"
                }`}
              >
                {tenantAds?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setSelectedPageType("home")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedPageType === "home"
                  ? "bg-primary text-white shadow-lg border-2 border-primary"
                  : "bg-background-primary text-text-secondary hover:bg-background-tertiary hover:text-text-primary border border-border-secondary"
              }`}
            >
              <span className="text-sm sm:text-base">🏠</span>
              <span>Home</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  selectedPageType === "home"
                    ? "bg-white/20 text-white"
                    : "bg-background-secondary text-text-secondary"
                }`}
              >
                {tenantAds?.filter((ad) =>
                  [
                    TenantAdPlacement.HEADER,
                    TenantAdPlacement.FOOTER,
                    TenantAdPlacement.SIDEBAR,
                    TenantAdPlacement.HOME_HERO,
                    TenantAdPlacement.HOME_BELOW_HERO,
                    TenantAdPlacement.CATEGORY_TOP,
                    TenantAdPlacement.CATEGORY_BOTTOM,
                    TenantAdPlacement.SEARCH_TOP,
                    TenantAdPlacement.SEARCH_BOTTOM,
                    TenantAdPlacement.BLOG_LIST_TOP,
                    TenantAdPlacement.BLOG_LIST_BOTTOM,
                  ].includes(ad.placement),
                ).length || 0}
              </span>
            </button>
            <button
              onClick={() => setSelectedPageType("blog")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedPageType === "blog"
                  ? "bg-primary text-white shadow-lg border-2 border-primary"
                  : "bg-background-primary text-text-secondary hover:bg-background-tertiary hover:text-text-primary border border-border-secondary"
              }`}
            >
              <span className="text-sm sm:text-base">📝</span>
              <span>Blog</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  selectedPageType === "blog"
                    ? "bg-white/20 text-white"
                    : "bg-background-secondary text-text-secondary"
                }`}
              >
                {tenantAds?.filter((ad) =>
                  [
                    TenantAdPlacement.ABOVE_TAGS,
                    TenantAdPlacement.UNDER_DATE,
                    TenantAdPlacement.UNDER_HERO,
                    TenantAdPlacement.ABOVE_SHAREABLE,
                    TenantAdPlacement.UNDER_SHAREABLE,
                    TenantAdPlacement.INLINE,
                  ].includes(ad.placement),
                ).length || 0}
              </span>
            </button>
          </div>
        </div>

        {/* Combined Filters Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Status Filter - Responsive */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-primary mb-2">
              Status
            </label>
            <div className="flex gap-1 sm:gap-2 flex-wrap">
              {[
                { value: "all", label: "All", count: filteredAds.length, icon: "📊" },
                {
                  value: "enabled",
                  label: "On",
                  count: filteredAds.filter((ad) => ad.isEnabled).length,
                  icon: "🟢",
                },
                {
                  value: "disabled",
                  label: "Off",
                  count: filteredAds.filter((ad) => !ad.isEnabled).length,
                  icon: "🔴",
                },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value as "all" | "enabled" | "disabled")}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 ${
                    statusFilter === filter.value
                      ? "bg-primary text-white shadow-lg scale-105 border-2 border-primary"
                      : "bg-background-primary text-text-secondary hover:bg-background-tertiary hover:text-text-primary border border-border-secondary"
                  }`}
                >
                  <span className="text-xs sm:text-sm">{filter.icon}</span>
                  <span className="hidden sm:inline">{filter.label}</span>
                  <span className="sm:hidden">{filter.label.charAt(0)}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                      statusFilter === filter.value
                        ? "bg-white/20 text-white"
                        : "bg-background-secondary text-text-secondary"
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Scope Filter - Enhanced & Responsive */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-primary mb-2">
              Scope
            </label>
            <div className="flex gap-1 sm:gap-2 flex-wrap">
              <button
                onClick={() => setScopeFilter("all")}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 ${
                  scopeFilter === "all"
                    ? "bg-primary text-white shadow-lg scale-105 border-2 border-primary"
                    : "bg-background-primary text-text-secondary hover:bg-background-tertiary hover:text-text-primary border border-border-secondary"
                }`}
              >
                <span className="text-xs sm:text-sm">🌐</span>
                <span className="hidden sm:inline">Show All</span>
                <span className="sm:hidden">All</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                    scopeFilter === "all"
                      ? "bg-white/20 text-white"
                      : "bg-background-secondary text-text-secondary"
                  }`}
                >
                  {tenantAds?.length || 0}
                </span>
              </button>
              {[
                {
                  value: AdScope.GLOBAL,
                  label: "Global",
                  icon: "🌍",
                  count:
                    tenantAds?.filter((ad) => ad.scope === AdScope.GLOBAL || ad.scope === "all")
                      .length || 0,
                },
                {
                  value: AdScope.MAIN,
                  label: "Main",
                  icon: "🏠",
                  count: tenantAds?.filter((ad) => ad.scope === AdScope.MAIN).length || 0,
                },
                // Add tenant-specific scopes dynamically
                ...(tenantAds?.reduce(
                  (acc, ad) => {
                    if (
                      ad.scope &&
                      ad.scope !== AdScope.GLOBAL &&
                      ad.scope !== AdScope.MAIN &&
                      ad.scope !== "all" && // Filter out the old "all" scope
                      !acc.find((s) => s.value === ad.scope)
                    ) {
                      const tenant = tenants?.find((t) => String(t.id) === ad.scope);
                      acc.push({
                        value: ad.scope,
                        label: tenant?.domain || ad.scope,
                        icon: "🏢",
                        count: tenantAds.filter((a) => a.scope === ad.scope).length,
                      });
                    }
                    return acc;
                  },
                  [] as Array<{ value: string; label: string; icon: string; count: number }>,
                ) || []),
              ].map((scope) => (
                <button
                  key={scope.value}
                  onClick={() => setScopeFilter(scope.value)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                    scopeFilter === scope.value
                      ? "bg-primary text-white shadow-lg scale-105 border-2 border-primary"
                      : "bg-background-primary text-text-secondary hover:bg-background-tertiary hover:text-text-primary border border-border-secondary"
                  }`}
                >
                  <span>{scope.icon}</span>
                  <span>{scope.label}</span>
                  <span
                    className={`px-1 py-0.5 rounded-full text-xs ${
                      scopeFilter === scope.value
                        ? "bg-white/20 text-white"
                        : "bg-background-secondary text-text-secondary"
                    }`}
                  >
                    {scope.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Placement Filter - Compact Dropdown & Responsive */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-primary mb-2">
              Placement
            </label>
            <div className="relative">
              <select
                value={placementFilter}
                onChange={(e) => setPlacementFilter(e.target.value)}
                className="w-full p-2 sm:p-3 bg-background-primary border border-border-secondary rounded-lg text-xs sm:text-sm text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">📍 All Placements ({filteredAds.length})</option>
                {currentPlacements.map((placement) => {
                  const count = filteredAds.filter((ad) => ad.placement === placement).length;

                  // Get icon and label for placement
                  const getPlacementInfo = (placement: string) => {
                    if (placement.includes("HEADER")) return { icon: "🔝", label: "Header" };
                    if (placement.includes("FOOTER")) return { icon: "🔻", label: "Footer" };
                    if (placement.includes("HOME_HERO")) return { icon: "🎯", label: "Home Hero" };
                    if (placement.includes("HOME_BELOW_HERO"))
                      return { icon: "📋", label: "Below Hero" };
                    if (placement.includes("ABOVE_TAGS"))
                      return { icon: "🏷️", label: "Above Tags" };
                    if (placement.includes("UNDER_DATE"))
                      return { icon: "📅", label: "Under Date" };
                    if (placement.includes("UNDER_HERO"))
                      return { icon: "🎯", label: "Under Hero" };
                    if (placement.includes("ABOVE_SHAREABLE"))
                      return { icon: "🔗", label: "Above Share" };
                    if (placement.includes("UNDER_SHAREABLE"))
                      return { icon: "🔗", label: "Under Share" };
                    if (placement.includes("INLINE")) return { icon: "📝", label: "Inline" };
                    if (placement.includes("SIDEBAR")) return { icon: "📋", label: "Sidebar" };
                    if (placement.includes("CATEGORY")) return { icon: "📂", label: "Category" };
                    if (placement.includes("SEARCH")) return { icon: "🔍", label: "Search" };
                    if (placement.includes("BLOG_LIST")) return { icon: "📄", label: "Blog List" };
                    return { icon: "📄", label: placement.replace(/_/g, " ") };
                  };

                  const { icon, label } = getPlacementInfo(placement);

                  return (
                    <option key={placement} value={placement}>
                      {icon} {label} ({count})
                    </option>
                  );
                })}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <label className="block text-xs font-medium text-text-primary mb-2">Quick Stats</label>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Total:</span>
                <span className="font-medium text-text-primary">{filteredAds.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Enabled:</span>
                <span className="font-medium text-green-600">
                  {filteredAds.filter((ad) => ad.isEnabled).length}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Scopes:</span>
                <span className="font-medium text-blue-600">{Object.keys(adsByScope).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Ads Grid - Desktop Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filteredAds.map((ad) => (
          <div
            key={ad.id}
            className="bg-background-secondary rounded-xl border border-border-secondary shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col h-full"
          >
            {/* Card Header */}
            <div className="p-6 lg:p-8 flex-shrink-0">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-2xl lg:text-3xl flex-shrink-0">
                    {ad.placement.includes("HEADER")
                      ? "🔝"
                      : ad.placement.includes("FOOTER")
                        ? "🔽"
                        : ad.placement.includes("HERO")
                          ? "🎯"
                          : ad.placement.includes("TAGS")
                            ? "🏷️"
                            : ad.placement.includes("DATE")
                              ? "📅"
                              : ad.placement.includes("SHARE")
                                ? "🔗"
                                : ad.placement.includes("INLINE")
                                  ? "📝"
                                  : "📄"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base lg:text-lg font-semibold text-text-primary truncate">
                      {ad.title || `${ad.placement.replace(/_/g, " ")} Ad`}
                    </h3>
                    <p className="text-sm text-text-secondary truncate">
                      {ad.scope === "all"
                        ? "Global"
                        : ad.scope === "main"
                          ? "Main Domain"
                          : tenants?.find((t) => String(t.id) === ad.scope)?.domain || ad.scope}
                    </p>
                  </div>
                </div>

                {/* Status Toggle - Inside Card */}
                <button
                  onClick={() => handleToggleEnabled(ad)}
                  disabled={updateMutation.isPending}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-2 ${
                    ad.isEnabled
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                  }`}
                >
                  {updateMutation.isPending ? (
                    <div className="flex items-center gap-1">
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                      <span className="hidden lg:inline">Updating...</span>
                      <span className="lg:hidden">...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-xs">{ad.isEnabled ? "🟢" : "🔴"}</span>
                      <span className="hidden lg:inline">{ad.isEnabled ? "On" : "Off"}</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Description */}
              {ad.description && (
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">
                  {ad.description}
                </p>
              )}

              {/* Details Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-background-primary rounded-md text-xs text-text-secondary">
                  Priority: {ad.priority}
                </span>
                <span className="px-2 py-1 bg-background-primary rounded-md text-xs text-text-secondary">
                  {ad.appearance.replace(/_/g, " ")}
                </span>
                {ad.placement === TenantAdPlacement.INLINE && ad.positionOffset && (
                  <span className="px-2 py-1 bg-background-primary rounded-md text-xs text-text-secondary">
                    Words: {ad.positionOffset}
                  </span>
                )}
              </div>
            </div>

            {/* Card Footer - Action Buttons */}
            <div className="mt-auto p-6 lg:p-8 pt-4 border-t border-border-secondary">
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(ad)}
                  className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setDeletingAd(ad);
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAds.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No Ads Found</h3>
          <p className="text-text-secondary mb-6">
            {statusFilter !== "all" || placementFilter !== "all"
              ? "No ads match your current filters. Try adjusting your filter settings."
              : "Get started by creating your first ad."}
          </p>
          <button
            onClick={() => {
              setEditingAd(null);
              setFormPageType("home");
              setFormData({
                tenantId: "main",
                placement: homePlacements[0],
                appearance: TenantAdAppearance.FULL_WIDTH,
                codeSnippet: "",
                isEnabled: true,
                priority: 0,
                title: "",
                description: "",
                scope: AdScope.GLOBAL,
                blogId: undefined,
                positionOffset: undefined,
              });
              setIsCreateModalOpen(true);
            }}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Create Your First Ad
          </button>
        </div>
      )}

      {/* Create/Edit Modal - Responsive */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-background-secondary rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-border-secondary shadow-2xl">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-text-primary">
                {editingAd ? "Edit Ad" : "Create New Ad"}
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-text-secondary hover:text-text-primary text-xl sm:text-2xl p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Page Type Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Page Type
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="pageType"
                      value="home"
                      checked={formPageType === "home"}
                      onChange={(e) => {
                        setFormPageType("home");
                        setFormData({ ...formData, placement: homePlacements[0] });
                      }}
                      className="w-4 h-4 text-primary bg-background-primary border-border-secondary focus:ring-primary focus:ring-2"
                    />
                    <span className="ml-2 text-sm font-medium text-text-primary">🏠 Home Page</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="pageType"
                      value="blog"
                      checked={formPageType === "blog"}
                      onChange={(e) => {
                        setFormPageType("blog");
                        setFormData({ ...formData, placement: blogPlacements[0] });
                      }}
                      className="w-4 h-4 text-primary bg-background-primary border-border-secondary focus:ring-primary focus:ring-2"
                    />
                    <span className="ml-2 text-sm font-medium text-text-primary">📝 Blog Page</span>
                  </label>
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  Choose whether this ad will appear on home page or blog pages
                </p>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 bg-background-primary border border-border-secondary rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ad title (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })
                    }
                    className="w-full p-3 bg-background-primary border border-border-secondary rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-background-primary border border-border-secondary rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Ad description (optional)"
                />
              </div>

              {/* Scope */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Scope</label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value as AdScope })}
                  className="w-full p-3 bg-background-primary border border-border-secondary rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {tenantOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Placement */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Placement
                </label>
                <select
                  value={formData.placement}
                  onChange={(e) =>
                    setFormData({ ...formData, placement: e.target.value as TenantAdPlacement })
                  }
                  className="w-full p-3 bg-background-primary border border-border-secondary rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {formPlacements.map((placement) => (
                    <option key={placement} value={placement}>
                      {placement.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Appearance */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Appearance
                </label>
                <select
                  value={formData.appearance}
                  onChange={(e) =>
                    setFormData({ ...formData, appearance: e.target.value as TenantAdAppearance })
                  }
                  className="w-full p-3 bg-background-primary border border-border-secondary rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={TenantAdAppearance.FULL_WIDTH}>Full Width</option>
                  <option value={TenantAdAppearance.LEFT_ALIGNED}>Left Aligned</option>
                  <option value={TenantAdAppearance.CENTERED}>Centered</option>
                  <option value={TenantAdAppearance.POPUP}>Popup</option>
                  <option value={TenantAdAppearance.STICKY}>Sticky</option>
                </select>
              </div>

              {/* Position Offset - Only show for INLINE placement */}
              {formData.placement === TenantAdPlacement.INLINE && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Word Position Offset
                  </label>
                  <input
                    type="number"
                    value={formData.positionOffset || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        positionOffset: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-full p-3 bg-background-primary border border-border-secondary rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Number of words before injecting ad (e.g., 150)"
                    min="1"
                  />
                  <p className="text-sm text-text-secondary mt-2">
                    The ad will be injected after this many words in the blog content. Leave empty
                    for default positioning.
                  </p>
                </div>
              )}

              {/* Code Snippet */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Ad Code Snippet
                </label>
                <textarea
                  value={formData.codeSnippet}
                  onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                  className="w-full p-3 bg-background-primary border border-border-secondary rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  rows={8}
                  placeholder="Paste your ad code here (HTML, JavaScript, AdSense, etc.)"
                  required
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isEnabled"
                  checked={formData.isEnabled}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  className="w-4 h-4 text-primary bg-background-primary border-border-secondary rounded focus:ring-primary"
                />
                <label htmlFor="isEnabled" className="text-sm font-medium text-text-primary">
                  Enable this ad
                </label>
              </div>

              {/* Submit Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-background-primary text-text-secondary hover:bg-background-tertiary border border-border-secondary rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {editingAd ? "Updating..." : "Creating..."}
                    </span>
                  ) : editingAd ? (
                    "Update Ad"
                  ) : (
                    "Create Ad"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-secondary rounded-2xl p-6 w-full max-w-md border border-border-secondary shadow-2xl">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Delete Ad</h3>
              <p className="text-text-secondary mb-6">
                Are you sure you want to delete "
                {deletingAd?.title || `${deletingAd?.placement.replace(/_/g, " ")} Ad`}"? This
                action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-3 bg-background-primary text-text-secondary hover:bg-background-tertiary border border-border-secondary rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
