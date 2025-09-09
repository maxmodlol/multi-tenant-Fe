"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle, Bug, RefreshCw } from "lucide-react";

export default function TestErrorsPage() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("This is a test error to demonstrate the error page!");
  }

  const triggerError = () => {
    setShouldThrow(true);
  };

  const triggerAsyncError = async () => {
    // Simulate an async error
    await new Promise((resolve) => setTimeout(resolve, 1000));
    throw new Error("This is an async test error!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg mb-6">
            <Bug className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            صفحة اختبار الأخطاء
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            هذه الصفحة لاختبار صفحات الأخطاء المختلفة في التطبيق
          </p>
        </div>

        {/* Test Buttons */}
        <div className="space-y-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              اختبار صفحات الأخطاء
            </h3>

            <div className="space-y-3">
              <Button
                onClick={triggerError}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <AlertTriangle className="w-5 h-5 ml-2" />
                اختبار خطأ المكون (Error Boundary)
              </Button>

              <Button
                onClick={triggerAsyncError}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                <RefreshCw className="w-5 h-5 ml-2" />
                اختبار خطأ غير متزامن
              </Button>

              <Button
                onClick={() => (window.location.href = "/non-existent-page")}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <AlertTriangle className="w-5 h-5 ml-2" />
                اختبار صفحة 404
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
            <li>• اضغط على "اختبار خطأ المكون" لرؤية Error Boundary</li>
            <li>• اضغط على "اختبار خطأ غير متزامن" لرؤية معالجة الأخطاء غير المتزامنة</li>
            <li>• اضغط على "اختبار صفحة 404" لرؤية صفحة 404</li>
            <li>• جرب الوصول لصفحة غير موجودة مباشرة من URL</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
