"use client";

import React, { useState, useMemo } from "react";
import { useTenantAds } from "@/src/hooks/dashboard/useTenantAds";
import { useTenantAdMutations } from "@/src/hooks/dashboard/mutations/useTenantAdMutations";
import { useTenants } from "@/src/hooks/dashboard/useTenants";
import { TenantAdPlacement, TenantAdAppearance, AdScope } from "@/src/types/tenantAds";
import type { TenantAdSetting, CreateTenantAdInput } from "@/src/types/tenantAds";

export default function HeaderSettingsForm() {
  console.log("🚀 HeaderSettingsForm: Component mounted!");

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
    scope: AdScope.ALL,
    blogId: undefined,
    positionOffset: undefined,
  });

  // Add filtering state
  const [statusFilter, setStatusFilter] = useState<"all" | "enabled" | "disabled">("all");

  // Fetch data
  const { data: tenantAds, isLoading: loadingAds, error: errorAds } = useTenantAds();
  const { data: tenants, isLoading: loadingTenants, error: errorTenants } = useTenants();

  // Get mutation hooks
  const { createMutation, updateMutation, deleteMutation } = useTenantAdMutations();

  // Filter only header ads
  const headerAds = useMemo(() => {
    if (!tenantAds) return [];
    return tenantAds.filter((ad) => ad.placement === TenantAdPlacement.HEADER);
  }, [tenantAds]);

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

  // Group header ads by scope
  const headerAdsByScope = useMemo(() => {
    if (!headerAds) return {};

    return headerAds.reduce(
      (acc, ad) => {
        const scopeKey = ad.scope || "main";
        if (!acc[scopeKey]) {
          acc[scopeKey] = [];
        }
        acc[scopeKey].push(ad);
        return acc;
      },
      {} as Record<string, TenantAdSetting[]>,
    );
  }, [headerAds]);

  // Filter header ads based on current filters
  const filteredHeaderAds = useMemo(() => {
    return headerAds.filter((ad) => {
      // Status filter
      if (statusFilter !== "all") {
        const isEnabled = ad.isEnabled;
        if (statusFilter === "enabled" && !isEnabled) return false;
        if (statusFilter === "disabled" && isEnabled) return false;
      }

      return true;
    });
  }, [headerAds, statusFilter]);

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
      setFormData({
        tenantId: "main",
        placement: TenantAdPlacement.HEADER,
        appearance: TenantAdAppearance.FULL_WIDTH,
        codeSnippet: "",
        isEnabled: true,
        priority: 0,
        title: "",
        description: "",
        scope: AdScope.ALL,
        blogId: undefined,
        positionOffset: undefined,
      });
    } catch (error) {
      console.error("Error saving header ad:", error);
    }
  };

  // Handle edit
  const handleEdit = (ad: TenantAdSetting) => {
    setEditingAd(ad);
    setFormData({
      tenantId: ad.tenantId,
      placement: ad.placement,
      appearance: ad.appearance,
      codeSnippet: ad.codeSnippet,
      isEnabled: ad.isEnabled,
      priority: ad.priority,
      title: ad.title || "",
      description: ad.description || "",
      scope: ad.scope || AdScope.ALL,
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
      console.error("Error deleting header ad:", error);
    }
  };

  if (loadingAds || loadingTenants) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading header ads configuration...</p>
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
          <p className="text-text-secondary">
            Failed to load header ads configuration. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center justify-center gap-3">
          <span className="text-primary">🔝</span>
          Header Ads Management
        </h1>
        <p className="text-text-secondary">
          Manage header ads that appear at the top of your pages across different scopes
        </p>
      </div>

      {/* Filters */}
      <div className="bg-background-secondary rounded-2xl p-6 border border-border-secondary shadow-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <span className="text-primary">🔍</span>
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "enabled" | "disabled")}
              className="w-full p-3 bg-background-primary border border-border-secondary rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="enabled">Enabled Only</option>
              <option value="disabled">Disabled Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-background-secondary rounded-2xl p-6 border border-border-secondary shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">{filteredHeaderAds.length}</div>
            <div className="text-sm text-text-secondary">Total Header Ads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-1">
              {filteredHeaderAds.filter((ad) => ad.isEnabled).length}
            </div>
            <div className="text-sm text-text-secondary">Enabled</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500 mb-1">
              {filteredHeaderAds.filter((ad) => !ad.isEnabled).length}
            </div>
            <div className="text-sm text-text-secondary">Disabled</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-1">
              {Object.keys(headerAdsByScope).length}
            </div>
            <div className="text-sm text-text-secondary">Scopes</div>
          </div>
        </div>
      </div>

      {/* Scope Tabs */}
      <div className="bg-background-secondary rounded-2xl p-6 lg:p-8 border border-border-secondary shadow-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <span className="text-primary">🎯</span>
          Header Ad Scopes
        </h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(headerAdsByScope).map(([scope, ads]) => (
            <button
              key={scope}
              className="group flex items-center px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm min-w-0 flex-shrink-0"
              style={{
                borderColor: scope === "all" ? "#3b82f6" : scope === "main" ? "#10b981" : "#8b5cf6",
                backgroundColor:
                  scope === "all" ? "#eff6ff" : scope === "main" ? "#ecfdf5" : "#faf5ff",
                color: scope === "all" ? "#1d4ed8" : scope === "main" ? "#047857" : "#7c3aed",
              }}
            >
              <span className="mr-2">
                {scope === "all" ? "🌍" : scope === "main" ? "🏠" : "🏢"}
              </span>
              <span className="truncate">
                {scope === "all"
                  ? "Global"
                  : scope === "main"
                    ? "Main Domain"
                    : tenants?.find((t) => String(t.id) === scope)?.domain || scope}
              </span>
              <span className="ml-2 px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs">
                {ads.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Header Ad Button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            setEditingAd(null);
            setFormData({
              tenantId: "main",
              placement: TenantAdPlacement.HEADER,
              appearance: TenantAdAppearance.FULL_WIDTH,
              codeSnippet: "",
              isEnabled: true,
              priority: 0,
              title: "",
              description: "",
              scope: AdScope.ALL,
              blogId: undefined,
              positionOffset: undefined,
            });
            setIsCreateModalOpen(true);
          }}
          className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <span className="text-xl">➕</span>
          Create New Header Ad
        </button>
      </div>

      {/* Header Ads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHeaderAds.map((ad) => (
          <div
            key={ad.id}
            className="bg-background-secondary rounded-2xl p-6 border border-border-secondary shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔝</span>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {ad.title || "Header Ad"}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {ad.scope === "all"
                      ? "Global"
                      : ad.scope === "main"
                        ? "Main Domain"
                        : tenants?.find((t) => String(t.id) === ad.scope)?.domain || ad.scope}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ad.isEnabled
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {ad.isEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            {ad.description && <p className="text-text-secondary mb-4 text-sm">{ad.description}</p>}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span>Priority: {ad.priority}</span>
                <span>Type: {ad.appearance.replace(/_/g, " ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(ad)}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setDeletingAd(ad);
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredHeaderAds.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔝</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No Header Ads Found</h3>
          <p className="text-text-secondary mb-6">
            {statusFilter !== "all"
              ? "No header ads match your current filter. Try adjusting your filter settings."
              : "Get started by creating your first header ad."}
          </p>
          <button
            onClick={() => {
              setEditingAd(null);
              setFormData({
                tenantId: "main",
                placement: TenantAdPlacement.HEADER,
                appearance: TenantAdAppearance.FULL_WIDTH,
                codeSnippet: "",
                isEnabled: true,
                priority: 0,
                title: "",
                description: "",
                scope: AdScope.ALL,
                blogId: undefined,
                positionOffset: undefined,
              });
              setIsCreateModalOpen(true);
            }}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Create Your First Header Ad
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-secondary rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border-secondary shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">
                {editingAd ? "Edit Header Ad" : "Create New Header Ad"}
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-text-secondary hover:text-text-primary text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 bg-background-primary border border-border-secondary rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Header ad title (optional)"
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
                  placeholder="Header ad description (optional)"
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
                  <option value={TenantAdAppearance.STICKY}>Sticky</option>
                </select>
              </div>

              {/* Code Snippet */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Header Ad Code Snippet
                </label>
                <textarea
                  value={formData.codeSnippet}
                  onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                  className="w-full p-3 bg-background-primary border border-border-secondary rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  rows={8}
                  placeholder="Paste your header ad code here (HTML, JavaScript, AdSense, etc.)"
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
                  Enable this header ad
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-3 bg-background-primary text-text-secondary hover:bg-background-tertiary border border-border-secondary rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {editingAd ? "Updating..." : "Creating..."}
                    </span>
                  ) : editingAd ? (
                    "Update Header Ad"
                  ) : (
                    "Create Header Ad"
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
              <h3 className="text-xl font-bold text-text-primary mb-2">Delete Header Ad</h3>
              <p className="text-text-secondary mb-6">
                Are you sure you want to delete "{deletingAd.title || "Header Ad"}"? This action
                cannot be undone.
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

