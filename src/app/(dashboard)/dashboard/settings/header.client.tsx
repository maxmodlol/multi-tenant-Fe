"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAdHeader } from "@/src/hooks/dashboard/useAdHeader";
import { useUpsertAdHeader } from "@/src/hooks/dashboard/mutations/useAdHeaderMutations";

import { Button } from "@explore/components/ui/button";
import { Switch } from "@explore/components/ui/switch";
import { Textarea } from "@explore/components/ui/textarea";
import { Spinner } from "@explore/components/ui/spinner";
import type { UpsertAdHeaderInput } from "@explore/types/ads";

export default function HeaderSettingsForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect non-admins/publishers away (optional; if you want extra guard on client side).
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const role = session.user.role;
      if (role !== "ADMIN" && role !== "PUBLISHER") {
        router.replace("/dashboard"); // or any “Not Allowed” page
      }
    }
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [session, status, router]);

  // 1) Fetch the existing AdHeaderSetting singleton:
  const { data: headerData, isLoading: isLoadingHeader, error: fetchError } = useAdHeader();

  // 2) Local form fields:
  const [headerSnippet, setHeaderSnippet] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  // 3) Populate local state once headerData arrives:
  useEffect(() => {
    if (headerData) {
      setHeaderSnippet(headerData.headerSnippet ?? "");
      setIsEnabled(headerData.isEnabled);
    }
  }, [headerData]);

  // 4) Prepare the upsert mutation:
  const upsertMutation = useUpsertAdHeader();

  // 5) Handle form submit:
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload: UpsertAdHeaderInput = {
      headerSnippet: headerSnippet.trim(),
      isEnabled,
    };

    if (!payload.headerSnippet) {
      toast.error("Header snippet لا يمكن أن يكون فارغًا.");
      return;
    }

    upsertMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("تم حفظ Header snippet بنجاح.");
      },
      onError: () => {
        toast.error("فشل حفظ Header snippet.");
      },
    });
  }

  if (status === "loading" || isLoadingHeader) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-4 text-red-600">حدث خطأ أثناء جلب إعدادات Header Ad. حاول التحديث.</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Header Ad Configuration</h2>

      {/* Toggle Enabled / Disabled */}
      <div className="flex items-center  space-x-3">
        <Switch
          id="header-ad-enabled"
          checked={isEnabled}
          onCheckedChange={(checked) => setIsEnabled(!!checked)}
        />
        <label htmlFor="header-ad-enabled" className="text-sm px-2 font-medium">
          تمكين Header Ad
        </label>
      </div>

      {/* Textarea for headerSnippet */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="header-snippet" className="text-sm font-medium">
          Header Snippet (وحدة السكربت)
        </label>
        <Textarea
          id="header-snippet"
          value={headerSnippet}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setHeaderSnippet(e.currentTarget.value)
          }
          className={`h-48 font-mono text-sm border ${!isEnabled ? "opacity-50" : ""}`}
          placeholder={`// ألصق هنا كود <script> الخاص بك`}
          disabled={!isEnabled}
        />
        <p className="text-xs text-gray-500">
          سيتم حقن هذا النص في &lt;head&gt; لكل صفحة عند التمكين.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={upsertMutation.isPending}>
          {upsertMutation.isPending ? "جاري الحفظ…" : "حفظ"}
        </Button>
      </div>
    </form>
  );
}
