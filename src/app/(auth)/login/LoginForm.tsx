"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Input } from "@explore/components/ui/input";
import { Button } from "@explore/components/ui/button";
import { signIn } from "next-auth/react";

const schema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور لا تقل عن 6 أحرف"),
});
type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    const res = await signIn("credentials", {
      ...data, // email, password
      redirect: false, // don’t let Next-Auth redirect for us
    });

    if (res?.ok) {
      router.replace("/dashboard");
    } else {
      toast.error(
        res?.status === 401
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[min(450px)] space-y-5 rounded-[12px] !bg-white  p-6 shadow-lg backdrop-blur-md
                 dark:border-gray-800 dark:bg-gray-900/80"
    >
      {/* e-mail field */}
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <Input placeholder="Enter your email" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* password field */}
      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <Input type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
      </div>

      {/* remember / forgot row */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
          Remember for 30&nbsp;days
        </label>
        <button
          type="button"
          className="font-medium text-brand-700 hover:underline"
          onClick={() => toast("Password reset coming soon!")}
        >
          Forgot password
        </button>
      </div>

      {/* submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
