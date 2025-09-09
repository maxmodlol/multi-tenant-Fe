"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle, RefreshCw, Home, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <AlertTriangle className="w-16 h-16 text-white" />
          </div>
          {/* Floating error indicators */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full animate-bounce opacity-70"></div>
          <div
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-400 rounded-full animate-bounce opacity-60"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-1/2 -right-8 w-3 h-3 bg-red-300 rounded-full animate-bounce opacity-50"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            حدث خطأ غير متوقع
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-4">
            نعتذر، حدث خطأ في الخادم. فريقنا يعمل على إصلاح هذه المشكلة.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            إذا استمرت المشكلة، يرجى المحاولة مرة أخرى لاحقاً أو التواصل معنا.
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 text-right">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
              تفاصيل الخطأ (وضع التطوير):
            </h3>
            <p className="text-xs text-red-700 dark:text-red-300 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                معرف الخطأ: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Decorative Elements */}
        <div className="flex justify-center items-center mb-8 space-x-4 rtl:space-x-reverse">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-red-500"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-red-500"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={reset}
            size="lg"
            className="group bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <RefreshCw className="w-5 h-5 ml-2 group-hover:rotate-180 transition-transform duration-500" />
            المحاولة مرة أخرى
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="group border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20 px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              <Home className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            هل تحتاج مساعدة؟
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">اتصل بنا</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                إذا استمرت المشكلة، تواصل مع فريق الدعم
              </p>
              <Link href="/contact">
                <Button variant="outline" size="sm" className="w-full">
                  صفحة التواصل
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">تحديث الصفحة</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                جرب تحديث الصفحة أو العودة لاحقاً
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="w-full"
              >
                تحديث الآن
              </Button>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-100 dark:bg-red-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-orange-100 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob-slower"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob-slow"></div>
        </div>
      </div>
    </div>
  );
}
