import type { Metadata } from "next";
import { fetchSiteSetting } from "@explore/services/settingService";
import { Button } from "@explore/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await fetchSiteSetting();
    return {
      title: `انضم إلى الناشرين - ${s.siteTitle || "مدونة الموقع"}`,
      description:
        s.siteDescription ||
        "انضم إلى فريق الكتابة لدينا وشارك معرفتك وخبرتك مع مجتمع المهنيين العرب",
    };
  } catch {
    return {
      title: "انضم إلى الناشرين - مدونة الموقع",
      description: "انضم إلى فريق الكتابة لدينا وشارك معرفتك وخبرتك مع مجتمع المهنيين العرب",
    };
  }
}

export default function JoinPublishersPage() {
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            انضم إلى الناشرين
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            انضم إلى فريق الكتابة لدينا وشارك معرفتك وخبرتك مع مجتمع المهنيين العرب. نحن نبحث عن
            كتاب موهوبين يشاركونا شغفهم بالمعرفة والتطوير.
          </p>
        </div>

        {/* Main Image Section */}
        <div className="mb-12 sm:mb-16">
          <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="فريق العمل في اجتماع"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">انضم إلى فريقنا</h3>
              <p className="text-white/90 text-sm sm:text-base">
                كن جزءاً من مجتمع الكتابة والتطوير
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="تأثير واسع"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">تأثير واسع</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              وصل إلى آلاف المهنيين العرب وشارك في تطوير المجتمع التقني والأعمال
            </p>
            <Button variant="outline" size="sm">
              معرفة المزيد
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt="مجتمع نشط"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">مجتمع نشط</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              انضم إلى مجتمع من المهنيين والخبراء في مختلف المجالات التقنية والأعمال
            </p>
            <Button variant="outline" size="sm">
              انضم الآن
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="دعم كامل"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">دعم كامل</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              نوفر لك الدعم التقني والتحريري لضمان جودة المحتوى والرؤى
            </p>
            <Button variant="outline" size="sm">
              احصل على الدعم
            </Button>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl mb-12 sm:mb-16 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-brand-600 dark:text-brand-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              متطلبات الانضمام
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              نبحث عن كتاب موهوبين يشاركونا شغفهم بالمعرفة والتطوير
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                خبرة في مجال التقنية أو الأعمال أو التطوير
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
              <p className="text-gray-700 dark:text-gray-300">مهارات كتابة ممتازة باللغة العربية</p>
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
              <p className="text-gray-700 dark:text-gray-300">القدرة على تقديم محتوى أصلي ومفيد</p>
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
              <p className="text-gray-700 dark:text-gray-300">الالتزام بالمواعيد النهائية</p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-brand-600 dark:text-brand-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              قدم طلبك الآن
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
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="أدخل اسمك الكامل"
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
                htmlFor="specialization"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                التخصص
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="مثال: تطوير الويب، الذكاء الاصطناعي، إدارة الأعمال"
              />
            </div>

            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                سنوات الخبرة
              </label>
              <select
                id="experience"
                name="experience"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">اختر سنوات الخبرة</option>
                <option value="0-1">0-1 سنة</option>
                <option value="2-3">2-3 سنوات</option>
                <option value="4-5">4-5 سنوات</option>
                <option value="6+">أكثر من 6 سنوات</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="portfolio"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                رابط المحفظة أو الأعمال السابقة
              </label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label
                htmlFor="sample"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                عينة من كتاباتك
              </label>
              <textarea
                id="sample"
                name="sample"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="اكتب هنا عينة من كتاباتك أو وصف لمقال تود كتابته..."
              ></textarea>
            </div>

            <div className="text-center">
              <Button type="submit" variant="primary" size="lg" className="px-8">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                إرسال الطلب
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
