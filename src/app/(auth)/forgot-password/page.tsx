"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Input } from "@explore/components/ui/input";
import { Button } from "@explore/components/ui/button";
import { getApiPublic } from "@/src/config/axiosPublic";

const schema = z.object({ email: z.string().email("بريد إلكتروني غير صالح") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      const api = await getApiPublic();
      await api.post("/auth/forgot-password", data);
      toast.success("تم إرسال رابط إعادة التعيين إن وُجد الحساب");
      reset();
    } catch (e: any) {
      toast.error("حدث خطأ. حاول لاحقًا");
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[min(450px)] space-y-5 rounded-[12px] !bg-white  p-6 shadow-lg backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80"
      >
        <h1 className="text-lg font-semibold">استرجاع كلمة المرور</h1>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input placeholder="you@example.com" {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "جارٍ الإرسال…" : "إرسال الرابط"}
        </Button>
      </form>
    </div>
  );
}


