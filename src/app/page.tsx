import BlogsList from "@explore/components/BlogList";
import FeaturedSlider from "@explore/components/FeaturedSlider";

export default function Home() {
  return (
    <div
      // This parent container applies padding to the whole page
      dir="rtl"
      className="
        w-full
        min-h-screen
        px-4
        md:px-14;
        py-10;
        bg-white
        
      "
    >
      {/* Top Section */}
      <section className="max-w-screen-xl mx-auto">
        <h1 className="text-right text-4xl font-bold text-gray-800 dark:text-gray-300">
          الموارد والرؤى
        </h1>
        <p className="mt-2 text-right text-gray-600 dark:text-gray-300">
          أحدث أخبار الصناعة، المقالات، الإرشادات، والنصائح
        </p>
      </section>

      {/* Spacing between sections */}
      <div className="my-8" />

      {/* Featured Slider Section */}
      <section className="max-w-screen-xl mx-auto">
        <FeaturedSlider />
      </section>
      <section>
        <BlogsList />
      </section>
    </div>
  );
}
