"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Input } from "@explore/components/ui/input";
import { Button } from "@explore/components/ui/button";
import { getApiPublic } from "@/src/config/axiosPublic";
import { Suspense } from "react";

const schema = z
  .object({
    password: z.string().min(6, "كلمة المرور لا تقل عن 6 أحرف"),
    confirm: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirm"],
  });
type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      const api = await getApiPublic();
      await api.post("/auth/reset-password", { token, password: data.password });
      toast.success("تم تغيير كلمة المرور بنجاح");
      router.replace("/login");
    } catch {
      toast.error("رابط غير صالح أو منتهي");
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[min(450px)] space-y-5 rounded-[12px] !bg-white  p-6 shadow-lg backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80"
      >
        <h1 className="text-lg font-semibold">إعادة تعيين كلمة المرور</h1>
        <div>
          <label className="mb-1 block text-sm font-medium">كلمة المرور الجديدة</label>
          <Input type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">تأكيد كلمة المرور</label>
          <Input type="password" placeholder="••••••••" {...register("confirm")} />
          {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "جارٍ الحفظ…" : "حفظ"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full items-center justify-center py-10">جارٍ التحميل...</div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
