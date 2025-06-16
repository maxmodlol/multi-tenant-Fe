"use client";

import { useState, ChangeEvent, FormEvent, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Button } from "@explore/components/ui/button";
import { Select } from "@explore/components/ui/select";
import { Textarea } from "@explore/components/ui/textarea";
import { Switch } from "@explore/components/ui/switch";
import Tag from "@explore/components/ui/tag";
import { Input } from "@explore/components/ui/input";

import {
  Placement,
  Appearance,
  CreateAdSettingInput,
  UpdateAdSettingInput,
} from "@explore/types/ads";
import { GlobalBlogIndex } from "@explore/types/blogs";

import { useGlobalBlogs } from "@/src/hooks/public/useGlobalBlogs";
import { useAdSettings } from "@/src/hooks/dashboard/useAdSetting";
import {
  useCreateAdSetting,
  useUpdateAdSetting,
  useDeleteAdSetting,
} from "@/src/hooks/dashboard/mutations/useAdSettingMutations";

interface SnippetItem {
  id: number;
  adId?: string; // existing AdSetting ID (if saved before)
  code: string;
  isEnabled: boolean;
  placement: Placement;
  appearance: Appearance;
  positionOffset?: number;
}

export default function AdsSettingsForm() {
  const qc = useQueryClient();

  // 1️⃣ Tenant & Blog selection
  const [tenant, setTenant] = useState<string>("");
  const [blogId, setBlogId] = useState<string>("");

  // 2️⃣ Which snippet tab is selected
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  // 3️⃣ Local copy of “snippets” for this blog
  const [snippets, setSnippets] = useState<SnippetItem[]>([
    {
      id: Date.now(),
      code: "// ضع كود الإعلان هنا\n",
      isEnabled: true,
      placement: Placement.UNDER_DATE,
      appearance: Appearance.LEFT_ALIGNED,
      positionOffset: 0,
    },
  ]);

  // 4️⃣ Fetch all approved blogs (global index)
  const { data: globalBlogs, isLoading: loadingGlobal, error: errorGlobal } = useGlobalBlogs();

  // 5️⃣ Derive “unique tenant list” and “blogs for selected tenant”
  const tenantList = useMemo(() => {
    if (!globalBlogs) return [];
    return Array.from(new Set(globalBlogs.map((b) => b.tenant)));
  }, [globalBlogs]);

  const blogList = useMemo(() => {
    if (!globalBlogs || !tenant) return [];
    return globalBlogs.filter((b) => b.tenant === tenant);
  }, [globalBlogs, tenant]);

  // 6️⃣ Fetch existing AdSettings for chosen blog
  const { data: existingAds } = useAdSettings(blogId);

  // 7️⃣ Whenever `existingAds` changes, re‐populate `snippets`
  useEffect(() => {
    if (existingAds && existingAds.length > 0) {
      setSnippets(
        existingAds.map((a) => ({
          id: Date.now() + Math.random(),
          adId: a.id,
          code: a.codeSnippet,
          isEnabled: a.isEnabled,
          placement: a.placement,
          appearance: a.appearance,
          positionOffset: a.positionOffset,
        })),
      );
    } else {
      setSnippets([
        {
          id: Date.now(),
          code: "// ضع كود الإعلان هنا\n",
          isEnabled: true,
          placement: Placement.UNDER_DATE,
          appearance: Appearance.LEFT_ALIGNED,
          positionOffset: 0,
        },
      ]);
    }
    setSelectedIdx(0);
  }, [existingAds]);

  // 8️⃣ Mutations
  const createMutation = useCreateAdSetting(blogId);
  const updateMutation = useUpdateAdSetting(blogId);
  const deleteMutation = useDeleteAdSetting(blogId);

  // 9️⃣ Helper: update one field on a snippet
  function updateSnippetField(idx: number, changes: Partial<Omit<SnippetItem, "id" | "adId">>) {
    setSnippets((prev) => prev.map((s, i) => (i === idx ? { ...s, ...changes } : s)));
  }

  // 🔟 “Add new snippet tab”
  function handleAddSnippet() {
    setSnippets((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        code: "// إعلان جديد\n",
        isEnabled: true,
        placement: Placement.UNDER_DATE,
        appearance: Appearance.LEFT_ALIGNED,
        positionOffset: 0,
      },
    ]);
    setSelectedIdx(snippets.length);
  }

  // 1️⃣1️⃣ “Remove snippet” (with confirmation + toast)
  function handleRemoveSnippet(idx: number) {
    const item = snippets[idx];
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا الإعلان؟")) return;

    // If this snippet was already saved (has adId), call the delete endpoint
    if (item.adId) {
      deleteMutation.mutate(item.adId, {
        onSuccess: () => {
          toast.success(`تم حذف الإعلان رقم ${idx + 1} بنجاح`);
        },
        onError: () => {
          toast.error(`فشل حذف الإعلان رقم ${idx + 1}`);
        },
      });
    } else {
      // Not yet saved to server, so just show a local toast
      toast("تم حذف الإعلان محليًا", { icon: "🗑️" });
    }

    // Remove from local state
    setSnippets((prev) => prev.filter((_, i) => i !== idx));
    setSelectedIdx((prev) => (prev > 0 ? prev - 1 : 0));
  }

  // 1️⃣2️⃣ “Save all changes”
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!tenant) {
      toast.error("الرجاء اختيار المستأجر أولاً");
      return;
    }
    if (!blogId) {
      toast.error("الرجاء اختيار المدونة أولاً");
      return;
    }

    const existing = existingAds ?? [];
    const newSnips = snippets.filter((s) => s.code.trim());

    // a) Delete any extra existing ads
    for (let i = newSnips.length; i < existing.length; i++) {
      deleteMutation.mutate(existing[i].id, {
        onSuccess: () => {
          toast.success("تم حذف الإعلان بنجاح");
        },
        onError: () => {
          toast.error("فشل حذف الإعلان");
        },
      });
    }

    // b) Update overlapping ads
    for (let i = 0; i < Math.min(newSnips.length, existing.length); i++) {
      const dto: UpdateAdSettingInput = {
        id: existing[i].id,
        placement: newSnips[i].placement,
        appearance: newSnips[i].appearance,
        codeSnippet: newSnips[i].code,
        isEnabled: newSnips[i].isEnabled,
        positionOffset:
          newSnips[i].placement === Placement.INLINE ? newSnips[i].positionOffset : undefined,
      };
      updateMutation.mutate(dto, {
        onSuccess: () => {
          toast.success("تم تحديث الإعلان");
        },
        onError: () => {
          toast.error("فشل تحديث الإعلان");
        },
      });
    }

    // c) Create any brand‐new snippets
    for (let i = existing.length; i < newSnips.length; i++) {
      const dto: CreateAdSettingInput = {
        blogId,
        placement: newSnips[i].placement,
        appearance: newSnips[i].appearance,
        codeSnippet: newSnips[i].code,
        isEnabled: newSnips[i].isEnabled,
        positionOffset:
          newSnips[i].placement === Placement.INLINE ? newSnips[i].positionOffset : undefined,
      };
      createMutation.mutate(dto, {
        onSuccess: () => {
          toast.success("تم إنشاء إعلان جديد");
        },
        onError: () => {
          toast.error("فشل إنشاء الإعلان");
        },
      });
    }
  }

  // 1️⃣3️⃣ The “currently selected” snippet
  const current = snippets[selectedIdx]!;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-lg p-lg bg-background-primary rounded-lg shadow-custom-2"
    >
      {/* — مُحدد المستأجر — */}
      <div>
        <label className="block text-sm font-medium text-text-primary">المستأجر</label>
        <Select
          value={tenant}
          onChange={setTenant}
          className="mt-1 w-full"
          placeholder="اختر المستأجر"
        >
          {tenantList.map((t) => (
            <Select.Item key={t} value={t}>
              {t}
            </Select.Item>
          ))}
        </Select>
        {errorGlobal && <p className="mt-1 text-xs text-error">فشل في تحميل قائمة المستأجرين.</p>}
      </div>

      {/* — مُحدد المدونة — */}
      <div>
        <label className="block text-sm font-medium text-text-primary">المدونة</label>
        <Select
          value={blogId}
          onChange={setBlogId}
          className="mt-1 w-full"
          placeholder={tenant ? "اختر المدونة" : "اختر المستأجر أولًا"}
          disabled={!tenant || loadingGlobal}
        >
          {blogList.map((b) => (
            <Select.Item key={b.blogId} value={b.blogId}>
              {b.title}
            </Select.Item>
          ))}
        </Select>
        {tenant && blogList.length === 0 && (
          <p className="mt-1 text-xs text-text-secondary">لا توجد مدونات معتمدة لهذا المستأجر.</p>
        )}
      </div>

      {/* — تبويبات الإعلانات — */}
      <div className="flex gap-sm overflow-x-auto">
        {snippets.map((s, idx) => (
          <Tag key={s.id} onClick={() => setSelectedIdx(idx)} isActive={idx === selectedIdx}>
            الإعلان {idx + 1}
          </Tag>
        ))}

        <Tag
          onClick={handleAddSnippet}
          className="border-border-secondary hover:bg-background-tertiary"
        >
          + إضافة
        </Tag>
      </div>

      {/* — بطاقة إعدادات الإعلان المختار — */}
      <div className="space-y-md">
        {/* تمكين */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">تمكين</span>
          <Switch
            checked={current.isEnabled}
            onCheckedChange={(checked) => updateSnippetField(selectedIdx, { isEnabled: checked })}
          />
        </div>

        {/* مكان الإعلان */}
        <div>
          <label className="block text-sm font-medium text-text-primary">مكان الإعلان</label>
          <Select
            value={current.placement}
            onChange={(v) => updateSnippetField(selectedIdx, { placement: v as Placement })}
            className="mt-1 w-full"
            placeholder="اختر مكان الإعلان"
          >
            <Select.Item value={Placement.ABOVE_TAGS}>فوق الوسوم</Select.Item>
            <Select.Item value={Placement.UNDER_DATE}>تحت التاريخ</Select.Item>
            <Select.Item value={Placement.UNDER_SHARE_1}>تحت رابط المشاركة 1</Select.Item>
            <Select.Item value={Placement.UNDER_SHARE_2}>تحت رابط المشاركة 2</Select.Item>
            <Select.Item value={Placement.INLINE}>ضمن المحتوى (بعد عدد كلمات)</Select.Item>
          </Select>
        </div>

        {/* تعويض الموضع (إذا INLINE) */}
        {current.placement === Placement.INLINE && (
          <div>
            <label className="block text-sm font-medium text-text-primary">عدد الكلمات</label>
            <Input
              type="number"
              min={0}
              value={current.positionOffset || 0}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateSnippetField(selectedIdx, {
                  positionOffset: parseInt(e.target.value, 10) || 0,
                })
              }
              className="mt-1 w-full"
              placeholder="عدد الكلمات"
            />
            <p className="mt-1 text-xs text-text-secondary">أدخل عدد الكلمات بعده يظهر الإعلان.</p>
          </div>
        )}

        {/* المظهر */}
        <div>
          <label className="block text-sm font-medium text-text-primary">المظهر</label>
          <div className="mt-2 flex gap-md">
            {[Appearance.LEFT_ALIGNED, Appearance.POPUP, Appearance.RIGHT_ALIGNED].map((val) => {
              const checked = current.appearance === val;
              let labelText = "";
              if (val === Appearance.LEFT_ALIGNED) labelText = "محاذاة لليسار";
              else if (val === Appearance.POPUP) labelText = "نافذة منبثقة";
              else if (val === Appearance.RIGHT_ALIGNED) labelText = "محاذاة لليمين";

              return (
                <label
                  key={val}
                  className={`flex-1 rounded-lg border px-md py-sm cursor-pointer ${
                    checked
                      ? "border-border-primary bg-background-secondary"
                      : "border-border-secondary bg-background-secondary"
                  }`}
                >
                  <div className="flex items-center space-x-sm">
                    <input
                      type="radio"
                      name={`appearance-${selectedIdx}`}
                      value={val}
                      checked={checked}
                      onChange={() => updateSnippetField(selectedIdx, { appearance: val })}
                      className="h-4 w-4 text-brand-primary"
                    />
                    <span className="font-medium text-text-primary">{labelText}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* كود الإعلان */}
        <div>
          <label className="block text-sm font-medium text-text-primary">كود الإعلان</label>
          <Textarea
            value={current.code}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              updateSnippetField(selectedIdx, { code: e.target.value })
            }
            className={`mt-1 w-full bg-background-secondary border border-border-secondary font-mono p-sm text-sm leading-snug ${
              !current.isEnabled ? "opacity-50" : ""
            }`}
            rows={6}
            placeholder="// ألصق كود الإعلان هنا"
            disabled={!current.isEnabled}
          />
        </div>

        {/* زر حذف الإعلان */}
        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            type="button"
            onClick={() => handleRemoveSnippet(selectedIdx)}
            className="w-full sm:w-auto"
          >
            حذف هذا الإعلان
          </Button>
        </div>
      </div>

      {/* — أزرار الحفظ / الإلغاء — */}
      <div className="flex justify-end space-x-sm pt-md border-t border-border-secondary">
        <Button variant="outline" size="sm" type="button">
          إلغاء
        </Button>
        <Button size="sm" type="submit">
          حفظ التغييرات
        </Button>
      </div>
    </form>
  );
}
