"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle, Bug, RefreshCw, CheckCircle } from "lucide-react";

export default function Test404Page() {
  const [testResults, setTestResults] = useState<{
    notFound: boolean;
    error: boolean;
    globalError: boolean;
  }>({
    notFound: false,
    error: false,
    globalError: false,
  });

  const testNotFound = () => {
    // This will trigger the not-found page
    window.location.href = "/non-existent-page-12345";
  };

  const testError = () => {
    // This will trigger the error page
    throw new Error("Test error for error page");
  };

  const testGlobalError = () => {
    // This will trigger the global error page
    throw new Error("Test global error");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            اختبار صفحات الأخطاء
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            تأكد من أن جميع صفحات الأخطاء تعمل بشكل صحيح
          </p>
        </div>

        {/* Test Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            حالة الاختبارات
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <div
                className={`w-3 h-3 rounded-full ${testResults.notFound ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">صفحة 404</span>
            </div>
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <div
                className={`w-3 h-3 rounded-full ${testResults.error ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">صفحة الخطأ</span>
            </div>
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <div
                className={`w-3 h-3 rounded-full ${testResults.globalError ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">خطأ عام</span>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              اختبار صفحات الأخطاء
            </h3>

            <div className="space-y-3">
              <Button
                onClick={testNotFound}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <AlertTriangle className="w-5 h-5 ml-2" />
                اختبار صفحة 404 (Not Found)
              </Button>

              <Button
                onClick={testError}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                <RefreshCw className="w-5 h-5 ml-2" />
                اختبار صفحة الخطأ (Error)
              </Button>

              <Button
                onClick={testGlobalError}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Bug className="w-5 h-5 ml-2" />
                اختبار الخطأ العام (Global Error)
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>ملاحظة:</strong> هذه الصفحة مخصصة للاختبار فقط. في الإنتاج، يجب حذف هذه
              الصفحة.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-right">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">تعليمات الاختبار:</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>• اضغط على "اختبار صفحة 404" للانتقال لصفحة غير موجودة</li>
            <li>• اضغط على "اختبار صفحة الخطأ" لرؤية صفحة الخطأ</li>
            <li>• اضغط على "اختبار الخطأ العام" لرؤية صفحة الخطأ العام</li>
            <li>• تأكد من أن كل صفحة تظهر التصميم الجميل وليس شاشة سوداء</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            روابط سريعة للاختبار:
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              onClick={() => (window.location.href = "/non-existent-page-1")}
              variant="outline"
              size="sm"
            >
              صفحة غير موجودة 1
            </Button>
            <Button
              onClick={() => (window.location.href = "/non-existent-page-2")}
              variant="outline"
              size="sm"
            >
              صفحة غير موجودة 2
            </Button>
            <Button
              onClick={() => (window.location.href = "/test-errors")}
              variant="outline"
              size="sm"
            >
              صفحة اختبار الأخطاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
