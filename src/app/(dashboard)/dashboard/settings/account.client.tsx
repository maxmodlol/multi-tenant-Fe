"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@explore/components/ui/button";
import { Input } from "@explore/components/ui/input";
import { getApiPrivate } from "@/src/config/axiosPrivate";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import { getAvatarUrl, handleAvatarError } from "@/src/utils/avatarUtils";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export default function AccountSettingsForm() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user profile data when component mounts
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true);
        const api = await getApiPrivate();
        const { data } = await api.get<UserProfile>("/auth/me/profile");

        // Initialize form with existing user data
        setName(data.name || "");
        setBio(data.bio || "");

        // Set avatar preview to existing avatar if available
        if (data.avatarUrl) {
          setAvatarPreview(data.avatarUrl);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
        toast.error("فشل في تحميل بيانات الملف الشخصي");
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      loadUserProfile();
    }
  }, [session?.user]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[a-z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score; // 0..5
  }, [newPassword]);

  async function saveProfile() {
    try {
      setSaving(true);
      const api = await getApiPrivate();
      let avatarUrl: string | null | undefined;

      if (avatarFile) {
        // Upload new avatar
        const fd = new FormData();
        fd.append("file", avatarFile);
        const { data } = await api.post<{ url: string }>("/auth/me/avatar", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        avatarUrl = data.url;
      } else if (avatarPreview === null) {
        // User wants to remove avatar
        avatarUrl = null;
      } else if (avatarPreview && !avatarPreview.startsWith("blob:")) {
        // Keep existing avatar
        avatarUrl = avatarPreview;
      }

      await api.put("/auth/me/profile", { name, bio, avatarUrl });
      toast.success("تم حفظ الملف الشخصي");

      // Update the avatar preview with the new URL
      if (avatarUrl) {
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview(null);
      }
      setAvatarFile(null); // Clear the file since it's now uploaded
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    try {
      setSaving(true);
      const api = await getApiPrivate();
      await api.post("/auth/me/change-password", { oldPassword, newPassword });
      toast.success("تم تغيير كلمة المرور");
      setOldPassword("");
      setNewPassword("");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "فشل التغيير");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-border-secondary bg-background-secondary p-4 space-y-3">
            <div className="text-sm text-text-tertiary">الملف الشخصي</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">الاسم</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">السيرة</label>
                <Input value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">الصورة الشخصية</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={getAvatarUrl(avatarPreview || session?.user?.avatarUrl)}
                      alt="avatar"
                      className="w-full h-full object-cover"
                      onError={handleAvatarError}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div
                      className={clsx(
                        "border border-dashed rounded-lg p-3 text-sm cursor-pointer",
                        "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
                      )}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const f = e.dataTransfer.files?.[0];
                        if (f) {
                          setAvatarFile(f);
                          const url = URL.createObjectURL(f);
                          setAvatarPreview((prev) => {
                            if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
                            return url;
                          });
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          id="avatar-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            setAvatarFile(f);
                            if (f) {
                              const url = URL.createObjectURL(f);
                              setAvatarPreview((prev) => {
                                if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
                                return url;
                              });
                            } else {
                              setAvatarPreview(null);
                            }
                          }}
                        />
                        <label htmlFor="avatar-input" className="underline cursor-pointer">
                          اختر صورة
                        </label>
                        <span className="text-gray-500">أو اسحبها وأفلتها هنا</span>
                      </div>
                    </div>
                    {(avatarPreview || (session?.user as any)?.avatarUrl) && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }}
                        className="text-sm text-red-600 hover:text-red-800 underline"
                      >
                        إزالة الصورة
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={saveProfile}
                disabled={saving}
                className="bg-background-brand-solid text-text-primary-brand hover:bg-background-brand-solid-hover"
              >
                حفظ
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border-secondary bg-background-secondary p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-text-tertiary">تغيير كلمة المرور</div>
              <Button variant="ghost" size="sm" onClick={() => setShowPasswords((s) => !s)}>
                {showPasswords ? "إخفاء" : "إظهار"}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">كلمة المرور الحالية</label>
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">كلمة المرور الجديدة</label>
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="h-2 rounded bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className={clsx(
                  "h-full transition-all",
                  passwordStrength <= 2 && "bg-error-400",
                  passwordStrength === 3 && "bg-warning-400",
                  passwordStrength >= 4 && "bg-success-400",
                )}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={changePassword}
                disabled={saving}
                className="bg-background-brand-solid text-text-primary-brand hover:bg-background-brand-solid-hover"
              >
                تغيير
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
