"use client";

import { useState, FormEvent } from "react";
import { Button } from "@explore/components/ui/button";
import { Input } from "@explore/components/ui/input";

export default function AccountSettingsForm() {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPwd !== confirmPwd) {
      setError("كلمة المرور الجديدة وتأكيدها غير متطابقين.");
      return;
    }
    if (newPwd.length < 8) {
      setError("يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/settings/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPwd,
          newPassword: newPwd,
        }),
      });
      if (!res.ok) throw new Error("فشل في تحديث كلمة المرور.");
      setSuccess("تم تحديث كلمة المرور بنجاح.");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        max-w-lg 
        space-y-6 
        bg-background-secondary 
        p-6 
        rounded-lg 
        shadow-custom-2
      "
    >
      <h3 className="text-lg font-medium text-text-primary">تغيير كلمة المرور</h3>

      {error && (
        <div className="rounded-md bg-error-50 border border-error p-3">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}
      {success && (
        <div className="rounded-md bg-success-50 border border-success p-3">
          <p className="text-sm text-success">{success}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          كلمة المرور الحالية
        </label>
        <Input
          type="password"
          value={currentPwd}
          onChange={(e) => setCurrentPwd(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          كلمة المرور الجديدة
        </label>
        <Input
          type="password"
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
          required
          minLength={8}
          placeholder="••••••••"
          className="w-full"
        />
        <p className="mt-1 text-xs text-text-secondary">يجب أن تكون 8 أحرف على الأقل.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          تأكيد كلمة المرور الجديدة
        </label>
        <Input
          type="password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          required
          minLength={8}
          placeholder="••••••••"
          className="w-full"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-border-secondary">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => {
            setCurrentPwd("");
            setNewPwd("");
            setConfirmPwd("");
            setError(null);
            setSuccess(null);
          }}
          disabled={submitting}
        >
          إلغاء
        </Button>
        <Button size="sm" type="submit" disabled={submitting}>
          {submitting ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>
    </form>
  );
}
