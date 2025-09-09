import type { Metadata } from "next";
import { fetchSiteSetting } from "@explore/services/settingService";
import { Button } from "@explore/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await fetchSiteSetting();
    return {
      title: `من نحن - ${s.siteTitle || "مدونة الموقع"}`,
      description:
        s.siteDescription || "تعرف على فريقنا وقيمنا ورسالتنا في تقديم أفضل المحتوى التقني",
    };
  } catch {
    return {
      title: "من نحن - مدونة الموقع",
      description: "تعرف على فريقنا وقيمنا ورسالتنا في تقديم أفضل المحتوى التقني",
    };
  }
}

export default function AboutPage() {
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            من نحن
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            نحن منصة "الموارد والرؤى" المتخصصة في تقديم أحدث الأخبار والمقالات والتحليلات في عالم
            التقنية والأعمال. نهدف إلى إثراء المعرفة وتقديم رؤى قيمة تساعد المهنيين والمطورين على
            البقاء في المقدمة.
          </p>
        </div>

        {/* Main Hero Image Section */}
        <div className="mb-12 sm:mb-16">
          <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="فريق العمل في اجتماع"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">فريقنا المتميز</h3>
              <p className="text-white/90 text-sm sm:text-base">
                خبراء في التقنية والأعمال يعملون لخدمتكم
              </p>
            </div>
          </div>
        </div>

        {/* Content Section with Images */}
        <div className="space-y-8 sm:space-y-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="مهمتنا"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">مهمتنا</h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  في عالم يتطور بسرعة البرق، نقدم لك أحدث الأخبار والمقالات والتحليلات في مجالات
                  التقنية والأعمال. فريقنا المتنوع من الخبراء والمحررين يعمل بجد لضمان حصولك على
                  معلومات دقيقة ومفيدة تساعدك على اتخاذ قرارات مدروسة.
                </p>
              </div>
            </div>
          </div>

          {/* Highlighted Section with Background Image */}
          <div className="relative bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border-l-4 border-brand-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt="رؤيتنا"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                رؤيتنا ورسالتنا
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                نهدف إلى أن نكون المصدر الأول للمهنيين والمطورين العرب للحصول على أحدث المعلومات
                والرؤى في عالم التقنية والأعمال. نؤمن بأن المعرفة الجيدة هي أساس النجاح، ونسعى
                لجعلها متاحة للجميع.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                    alt="التزامنا"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  التزامنا
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  منذ تأسيسنا، كنا ملتزمين بتقديم محتوى عالي الجودة يلبي احتياجات المهنيين والمطورين
                  العرب. نعمل على تقديم أحدث التقنيات والمفاهيم والأخبار بطريقة واضحة ومفهومة، مع
                  الحفاظ على الدقة والشمولية.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Software and Tools Section */}
        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              البرمجيات والأدوات
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              نستخدم أحدث التقنيات والأدوات في تطوير وإدارة منصتنا. من React وNext.js إلى أدوات
              التحليل والمراقبة، نضمن لك تجربة سلسة ومتطورة في تصفح المحتوى والوصول إلى المعلومات.
            </p>
          </div>

          {/* Tech Stack Grid with Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                name: "React",
                icon: "⚛️",
                image:
                  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                color: "bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400",
              },
              {
                name: "Next.js",
                icon: "▲",
                image:
                  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                color: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
              },
              {
                name: "TypeScript",
                icon: "📘",
                image:
                  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2028&q=80",
                color: "bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400",
              },
              {
                name: "Tailwind",
                icon: "🎨",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                color: "bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400",
              },
            ].map((tech, index) => (
              <div
                key={index}
                className={`${tech.color} rounded-xl p-4 text-center font-semibold border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group`}
              >
                <div className="relative w-12 h-12 mx-auto mb-3 rounded-lg overflow-hidden">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="text-2xl mb-2">{tech.icon}</div>
                <div>{tech.name}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="primary" size="lg" className="px-8">
              اكتشف المزيد
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
