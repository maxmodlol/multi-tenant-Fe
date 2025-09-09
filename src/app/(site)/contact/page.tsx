import type { Metadata } from "next";
import { fetchSiteSetting } from "@explore/services/settingService";
import { Button } from "@explore/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await fetchSiteSetting();
    return {
      title: `اتصل بنا - ${s.siteTitle || "مدونة الموقع"}`,
      description:
        s.siteDescription || "تواصل معنا للحصول على المساعدة أو لطرح أي استفسارات حول منصتنا",
    };
  } catch {
    return {
      title: "اتصل بنا - مدونة الموقع",
      description: "تواصل معنا للحصول على المساعدة أو لطرح أي استفسارات حول منصتنا",
    };
  }
}

export default function ContactPage() {
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
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            اتصل بنا
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            نحن هنا لمساعدتك! تواصل معنا للحصول على الدعم أو لطرح أي استفسارات حول منصة "الموارد
            والرؤى" أو إذا كنت مهتماً بالانضمام إلى فريق الكتابة.
          </p>
        </div>

        {/* Main Image Section */}
        <div className="mb-12 sm:mb-16">
          <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
              alt="فريق العمل في اجتماع"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">نحن هنا لمساعدتك</h3>
              <p className="text-white/90 text-sm sm:text-base">فريق دعم متاح على مدار الساعة</p>
            </div>
          </div>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
                alt="البريد الإلكتروني"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              البريد الإلكتروني
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">info@example.com</p>
            <Button variant="outline" size="sm">
              إرسال رسالة
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2039&q=80"
                alt="وسائل التواصل"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">وسائل التواصل</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">تويتر ولينكد إن</p>
            <Button variant="outline" size="sm">
              متابعة
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="وقت الاستجابة"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">وقت الاستجابة</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">24-48 ساعة</p>
            <Button variant="outline" size="sm">
              معرفة المزيد
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8 sm:space-y-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="نقدر ملاحظاتك"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  نقدر ملاحظاتك
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  نقدر ملاحظاتك واقتراحاتك، فهي تساعدنا على تحسين المحتوى وتطوير منصة "الموارد
                  والرؤى". سواء كنت مهنياً مبتدئاً أو خبيراً، نحن نريد أن نسمع منك ونعرف كيف يمكننا
                  خدمتك بشكل أفضل.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                    alt="انضم إلى فريق الكتابة"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  انضم إلى فريق الكتابة
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  إذا كنت مهتماً بالكتابة معنا أو لديك فكرة لمقال في مجالات التقنية أو الأعمال، نرحب
                  بك! نحن نبحث دائماً عن كتاب موهوبين يشاركونا شغفهم بالمعرفة والتطوير.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-12 sm:mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                أرسل لنا رسالة
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    الاسم
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  الموضوع
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="موضوع الرسالة"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  الرسالة
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>

              <div className="text-center">
                <Button type="submit" variant="primary" size="lg" className="px-8">
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  إرسال الرسالة
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
