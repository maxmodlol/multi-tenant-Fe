// app/(dashboard)/settings/account.client.tsx
"use client";

import { useState, FormEvent } from "react";
import { Button } from "@explore/components/ui/button";

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
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPwd.length < 8) {
      setError("Password must be at least 8 characters.");
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
      if (!res.ok) throw new Error("Failed to update password.");
      setSuccess("Password updated successfully.");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err: any) {
      setError(err.message || "Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <h3 className="text-lg font-medium">Change password</h3>

      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
      {success && <p className="text-sm text-green-600 bg-green-50 p-2 rounded">{success}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Current password</label>
        <input
          type="password"
          value={currentPwd}
          onChange={(e) => setCurrentPwd(e.target.value)}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">New password</label>
        <input
          type="password"
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
          required
          minLength={8}
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm new password</label>
        <input
          type="password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          required
          minLength={8}
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
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
          Cancel
        </Button>
        <Button size="sm" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save password"}
        </Button>
      </div>
    </form>
  );
}
