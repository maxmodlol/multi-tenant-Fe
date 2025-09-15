"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select } from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { useGlobalBlogs } from "@/src/hooks/public/useGlobalBlogs";
import { useTenants } from "@/src/hooks/dashboard/useTenants";
import { useTenantAds } from "@/src/hooks/dashboard/useTenantAds";
import { useTenantAdMutations } from "@/src/hooks/dashboard/mutations/useTenantAdMutations";
import { TenantAdPlacement, TenantAdAppearance } from "@/src/types/tenantAds";

export default function TenantAdsClient() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAd, setDeletingAd] = useState<any>(null);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [formData, setFormData] = useState({
    tenantId: "main",
    placement: TenantAdPlacement.HEADER,
    appearance: TenantAdAppearance.FULL_WIDTH,
    codeSnippet: "",
    isEnabled: true,
    priority: 0,
    title: "",
    description: "",
  });

  // Fetch all approved blogs (global index) - reusing existing pattern
  const { data: globalBlogs, isLoading: loadingGlobal, error: errorGlobal } = useGlobalBlogs();

  // Fetch all tenants directly
  const { data: tenants, isLoading: loadingTenants, error: errorTenants } = useTenants();

  // Fetch tenant ads using the proper hook
  const { data: tenantAds, isLoading: loadingAds, error: errorAds } = useTenantAds();

  // Get mutation hooks
  const { createMutation, updateMutation, deleteMutation } = useTenantAdMutations();

  // Derive "unique tenant list" from tenants data instead of globalBlogs
  const tenantList = useMemo(() => {
    if (!tenants) return [];
    return tenants.map((t) => t.domain);
  }, [tenants]);

  // Create tenant options from available tenants only
  const availableTenants = useMemo(() => {
    const tenants = tenantList.map((tenant) => ({
      id: tenant,
      name: `Tenant: ${tenant}`,
      subdomain: tenant,
    }));
    return tenants;
  }, [tenantList]);

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
      // Reset form
      setFormData({
        tenantId: "main",
        placement: TenantAdPlacement.HEADER,
        appearance: TenantAdAppearance.FULL_WIDTH,
        codeSnippet: "",
        isEnabled: true,
        priority: 0,
        title: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to save ad:", error);
    }
  };

  const handleEdit = (ad: any) => {
    setEditingAd(ad);
    setFormData({
      tenantId: ad.tenantId || "main",
      placement: ad.placement,
      appearance: ad.appearance,
      codeSnippet: ad.codeSnippet,
      isEnabled: ad.isEnabled,
      priority: ad.priority,
      title: ad.title || "",
      description: ad.description || "",
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (ad: any) => {
    setDeletingAd(ad);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingAd) return;

    try {
      await deleteMutation.mutateAsync(deletingAd.id);
      setIsDeleteModalOpen(false);
      setDeletingAd(null);
    } catch (error) {
      console.error("Failed to delete ad:", error);
    }
  };

  const openCreateModal = () => {
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
    });
    setIsCreateModalOpen(true);
  };

  // Show loading state
  if (loadingGlobal || loadingTenants || loadingAds) {
    return (
      <div className="p-6">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  // Show error state
  if (errorGlobal || errorTenants || errorAds) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">حدث خطأ في تحميل البيانات</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إعدادات الإعلانات العامة</h1>
          <p className="text-gray-600 mt-1">إدارة الإعلانات عبر جميع المواقع والمستأجرين</p>
        </div>
        <Button onClick={openCreateModal} className="px-6 py-2">
          ➕ إضافة إعلان جديد
        </Button>
      </div>

      {/* Stats */}
      {tenantAds && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{tenantAds.length}</div>
            <div className="text-sm text-gray-600">إجمالي الإعلانات</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {tenantAds.filter((ad) => ad.isEnabled).length}
            </div>
            <div className="text-sm text-gray-600">الإعلانات المفعلة</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {tenantAds.filter((ad) => !ad.isEnabled).length}
            </div>
            <div className="text-sm text-gray-600">الإعلانات المعطلة</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {Array.from(new Set(tenantAds.map((ad) => ad.tenantId))).length}
            </div>
            <div className="text-sm text-gray-600">المواقع المستهدفة</div>
          </div>
        </div>
      )}

      {/* Ads List */}
      <div className="space-y-4">
        {tenantAds && tenantAds.length > 0 ? (
          tenantAds.map((ad) => (
            <div
              key={ad.id}
              className="border rounded-lg p-6 space-y-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ad.title || `إعلان ${getPlacementLabel(ad.placement)}`}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ad.isEnabled
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {ad.isEnabled ? "مفعل" : "معطل"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      الأولوية: {ad.priority}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">الموقع المستهدف:</span>{" "}
                      {`Tenant: ${ad.tenantId}`}
                    </div>
                    <div>
                      <span className="font-medium">الموضع:</span> {getPlacementLabel(ad.placement)}
                    </div>
                    <div>
                      <span className="font-medium">المظهر:</span>{" "}
                      {getAppearanceLabel(ad.appearance)}
                    </div>
                    <div>
                      <span className="font-medium">تاريخ الإنشاء:</span>{" "}
                      {new Date(ad.createdAt).toLocaleDateString("ar-SA")}
                    </div>
                  </div>

                  {ad.description && (
                    <p className="text-sm text-gray-500 mt-3 p-3 bg-gray-50 rounded border-r-4 border-gray-300">
                      {ad.description}
                    </p>
                  )}

                  <div className="mt-3 p-3 bg-gray-50 rounded border font-mono text-xs overflow-x-auto">
                    <div className="font-medium text-gray-700 mb-1">كود الإعلان:</div>
                    <code className="text-gray-600">{ad.codeSnippet}</code>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(ad)}>
                    ✏️ تعديل
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(ad)}>
                    🗑️ حذف
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-12">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-xl font-medium mb-2">لا توجد إعلانات عامة بعد</h3>
            <p className="text-gray-400">قم بإضافة إعلان جديد لبدء استخدام النظام</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingAd ? "✏️ تعديل الإعلان" : "➕ إضافة إعلان جديد"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tenant Selection */}
            <div className="space-y-2">
              <Label htmlFor="tenantId">الموقع المستهدف *</Label>
              <Select
                value={formData.tenantId}
                onChange={(value) => setFormData({ ...formData, tenantId: value })}
                placeholder="اختر الموقع"
              >
                {availableTenants.map((tenant) => (
                  <Select.Item key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </Select.Item>
                ))}
              </Select>
              <p className="text-xs text-gray-500">اختر الموقع الذي سيظهر فيه الإعلان</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="placement">الموضع *</Label>
                <Select
                  value={formData.placement}
                  onChange={(value) =>
                    setFormData({ ...formData, placement: value as TenantAdPlacement })
                  }
                  placeholder="اختر الموضع"
                >
                  {Object.values(TenantAdPlacement).map((placement) => (
                    <Select.Item key={placement} value={placement}>
                      {getPlacementLabel(placement)}
                    </Select.Item>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appearance">المظهر *</Label>
                <Select
                  value={formData.appearance}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      appearance: value as TenantAdAppearance,
                    })
                  }
                  placeholder="اختر المظهر"
                >
                  {Object.values(TenantAdAppearance).map((appearance) => (
                    <Select.Item key={appearance} value={appearance}>
                      {getAppearanceLabel(appearance)}
                    </Select.Item>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="priority">الأولوية</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })
                  }
                  min="0"
                  max="100"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">الأرقام الأعلى تظهر أولاً</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isEnabled">الحالة</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isEnabled"
                    checked={formData.isEnabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
                  />
                  <Label htmlFor="isEnabled">{formData.isEnabled ? "مفعل" : "معطل"}</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">العنوان</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="اسم الإعلان (اختياري)"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف مختصر للإعلان (اختياري)"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codeSnippet">كود الإعلان *</Label>
              <Textarea
                id="codeSnippet"
                value={formData.codeSnippet}
                onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                placeholder="أدخل كود HTML/JavaScript للإعلان"
                rows={8}
                className="font-mono text-sm w-full"
              />
              <p className="text-xs text-gray-500">يمكنك استخدام HTML و CSS و JavaScript</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending
                  ? "⏳ جاري الحفظ..."
                  : editingAd
                    ? "💾 تحديث"
                    : "➕ إنشاء"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            هل أنت متأكد من حذف الإعلان "{deletingAd?.title || deletingAd?.placement}"? هذه العملية
            غير قابلة للتراجع.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getPlacementLabel(placement: TenantAdPlacement): string {
  const labels: Record<TenantAdPlacement, string> = {
    [TenantAdPlacement.HEADER]: "الهيدر",
    [TenantAdPlacement.FOOTER]: "الفوتر",
    [TenantAdPlacement.SIDEBAR]: "الشريط الجانبي",
    [TenantAdPlacement.HOME_HERO]: "الصفحة الرئيسية - فوق البطل",
    [TenantAdPlacement.HOME_BELOW_HERO]: "الصفحة الرئيسية - تحت البطل",
    [TenantAdPlacement.CATEGORY_TOP]: "الصفحات - أعلى",
    [TenantAdPlacement.CATEGORY_BOTTOM]: "الصفحات - أسفل",
    [TenantAdPlacement.SEARCH_TOP]: "البحث - أعلى",
    [TenantAdPlacement.SEARCH_BOTTOM]: "البحث - أسفل",
    [TenantAdPlacement.BLOG_LIST_TOP]: "قائمة المدونات - أعلى",
    [TenantAdPlacement.BLOG_LIST_BOTTOM]: "قائمة المدونات - أسفل",
  };
  return labels[placement];
}

function getAppearanceLabel(appearance: TenantAdAppearance): string {
  const labels: Record<TenantAdAppearance, string> = {
    [TenantAdAppearance.FULL_WIDTH]: "عرض كامل",
    [TenantAdAppearance.LEFT_ALIGNED]: "محاذاة يسار",
    [TenantAdAppearance.RIGHT_ALIGNED]: "محاذاة يمين",
    [TenantAdAppearance.CENTERED]: "وسط",
    [TenantAdAppearance.POPUP]: "نافذة منبثقة",
    [TenantAdAppearance.STICKY]: "ثابت",
  };
  return labels[appearance];
}
