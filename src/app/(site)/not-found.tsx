import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Home, Search, FileText } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-9xl sm:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700 dark:from-brand-400 dark:to-brand-600 animate-gradient-x">
            404
          </h1>
          {/* Floating particles around 404 */}
          <div className="absolute -top-4 -right-4 w-3 h-3 bg-brand-400 rounded-full animate-float opacity-60"></div>
          <div
            className="absolute top-1/2 -left-8 w-2 h-2 bg-brand-300 rounded-full animate-float opacity-40"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-8 -right-12 w-4 h-4 bg-brand-500 rounded-full animate-float opacity-50"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/3 -left-16 w-2 h-2 bg-brand-600 rounded-full animate-float opacity-30"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            الصفحة غير موجودة
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها. قد تكون الصفحة قد تم نقلها أو حذفها.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center items-center mb-8 space-x-4 rtl:space-x-reverse">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-brand-500"></div>
          <div className="w-3 h-3 bg-brand-500 rounded-full animate-pulse"></div>
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-brand-500"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/">
            <Button
              size="lg"
              className="group bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Home className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              العودة للرئيسية
            </Button>
          </Link>

          <Link href="/search">
            <Button
              variant="outline"
              size="lg"
              className="group border-brand-300 text-brand-700 hover:bg-brand-50 dark:border-brand-600 dark:text-brand-300 dark:hover:bg-brand-900/20 px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              <Search className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
              البحث
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            صفحات قد تهمك
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/about"
              className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors duration-300">
                من نحن
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">تعرف على المزيد عنا</p>
            </Link>

            <Link
              href="/contact"
              className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors duration-300">
                اتصل بنا
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">نحن هنا لمساعدتك</p>
            </Link>

            <Link
              href="/publishers/join"
              className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all duration-300 sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors duration-300">
                انضم إلينا
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">كن جزءاً من فريقنا</p>
            </Link>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-100 dark:bg-brand-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob-slower"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob-slow"></div>
        </div>
      </div>
    </div>
  );
}
