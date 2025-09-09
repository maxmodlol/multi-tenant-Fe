import type { Metadata } from "next";
import { fetchSiteSetting } from "@explore/services/settingService";
import { Button } from "@explore/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await fetchSiteSetting();
    return {
      title: `سياسة الخصوصية - ${s.siteTitle || "مدونة الموقع"}`,
      description: "سياسة الخصوصية وحماية البيانات الشخصية",
    };
  } catch {
    return {
      title: "سياسة الخصوصية - مدونة الموقع",
      description: "سياسة الخصوصية وحماية البيانات الشخصية",
    };
  }
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-brand-100 dark:bg-brand-900 rounded-full mb-6">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-brand-600 dark:text-brand-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            سياسة الخصوصية
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            نحن في منصة "الموارد والرؤى" ملتزمون بحماية خصوصيتك وبياناتك الشخصية. هذه السياسة توضح
            كيفية جمعنا واستخدامنا وحماية معلوماتك أثناء استخدامك لمنصتنا.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 sm:space-y-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4 rtl:space-x-reverse mb-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="المعلومات التي نجمعها"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  المعلومات التي نجمعها
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  نجمع المعلومات التي تقدمها لنا مباشرة، مثل:
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  معلومات الحساب (الاسم، البريد الإلكتروني)
                </p>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">معلومات الاتصال عند التواصل معنا</p>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">التعليقات والتفاعلات على المحتوى</p>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">بيانات الاستخدام والتفضيلات</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4 rtl:space-x-reverse mb-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="كيفية استخدام المعلومات"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  كيفية استخدام المعلومات
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  نستخدم معلوماتك لـ:
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">تقديم وتحسين خدماتنا</p>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">التواصل معك حول المحتوى والخدمات</p>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  تحليل استخدام الموقع لتحسين التجربة
                </p>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  حماية الموقع من الاستخدام غير المصرح به
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border-l-4 border-brand-500">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              حماية البيانات
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              نتخذ تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو
              الكشف أو التدمير. نستخدم تشفير SSL ونتبع أفضل الممارسات الأمنية في الصناعة.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                    alt="مشاركة المعلومات"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  مشاركة المعلومات
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات المحددة في
                  هذه السياسة أو بموافقتك الصريحة.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              حقوقك
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              لديك الحق في:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">الوصول إلى معلوماتك الشخصية</p>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">تصحيح أو تحديث معلوماتك</p>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">حذف حسابك ومعلوماتك</p>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">سحب موافقتك على معالجة بياناتك</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="التحديثات على هذه السياسة"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  التحديثات على هذه السياسة
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  قد نقوم بتحديث هذه السياسة من وقت لآخر. سنقوم بإشعارك بأي تغييرات مهمة عبر الموقع
                  أو البريد الإلكتروني.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border-l-4 border-brand-500">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              التواصل معنا
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              إذا كان لديك أي أسئلة حول هذه السياسة، يرجى التواصل معنا عبر صفحة
              <a
                href="/contact"
                className="text-brand-600 hover:text-brand-800 underline font-medium"
              >
                {" "}
                اتصل بنا
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
