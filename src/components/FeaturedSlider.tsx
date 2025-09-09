// -----------------------------------------------------------------------------
// FeaturedSlider.tsx – EXACT match to provided Figma reference
// -----------------------------------------------------------------------------

"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-creative";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCreative } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { useBlogs } from "@/src/hooks/public/useBlogs";
import BlogCard from "./BlogCard";
import { Blog } from "@explore/types/blogs";
import { Button } from "./ui/button";

interface FeaturedSliderProps {
  initialBlogs: Blog[];
  initialTotalPages: number;
  initialTotalBlogs: number;
}

export default function FeaturedSlider({
  initialBlogs,
  initialTotalPages,
  initialTotalBlogs,
}: FeaturedSliderProps) {
  const { data } = useBlogs("all", 1, initialBlogs.length, {
    initialData: {
      blogs: initialBlogs,
      totalPages: initialTotalPages,
      totalBlogs: initialTotalBlogs,
    },
  });

  const blogs = data?.blogs ?? [];
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!blogs.length) return null;

  return (
    <section className="relative w-full md:max-w-[1140px] mx-auto h-[400px] md:h-[600px] rounded-2xl overflow-hidden">
      <Swiper
        dir="rtl"
        modules={[Navigation, Autoplay, EffectCreative]}
        slidesPerView={1}
        effect="creative"
        creativeEffect={{
          // In RTL, "prev" visually goes right and "next" goes left
          prev: { translate: ["0%", 0, -1] },
          next: { translate: ["-100%", 0, 0] },
        }}
        speed={800}
        autoplay={{ delay: 4000 }}
        navigation={!isMobile ? { prevEl: prevRef.current, nextEl: nextRef.current } : undefined}
        onSwiper={(s) => {
          if (!isMobile) {
            s.navigation.init();
            s.navigation.update();
          }
          setIsBeginning(s.isBeginning);
          setIsEnd(s.isEnd);
        }}
        onSlideChange={(s) => {
          setIsBeginning(s.isBeginning);
          setIsEnd(s.isEnd);
        }}
        className="w-full h-full"
      >
        {blogs.map((blog) => (
          <SwiperSlide key={blog.id} className="h-full select-none">
            {/* use BlogCard with `slider` type so we get the exact overlay */}

            <BlogCard blog={blog} type="slider" />
          </SwiperSlide>
        ))}
        <div className="absolute bottom-12 left-6 z-10 hidden md:flex items-center ">
          <Button
            ref={nextRef}
            variant="ghost"
            size="icon"
            disabled={isEnd}
            aria-label="التالي"
            className={clsx(
              "h-14 w-14 p-0 bg-transparent hover:bg-black/40 text-white",
              "shadow-none ring-0",
              "flex items-center justify-center transition-transform active:scale-95",
              isEnd && "opacity-50 cursor-not-allowed",
            )}
          >
            <Image src="/icons/arrow-right.svg" alt="next" width={44} height={44} />
          </Button>
          <Button
            ref={prevRef}
            variant="ghost"
            size="icon"
            disabled={isBeginning}
            aria-label="السابق"
            className={clsx(
              "h-14 w-14 p-0 bg-black/30 hover:bg-black/40 text-white",
              "shadow-none ring-0",
              "flex items-center justify-center transition-transform active:scale-95",
              isBeginning && "opacity-50 cursor-not-allowed",
            )}
          >
            <Image src="/icons/arrow-left.svg" alt="prev" width={44} height={44} />
          </Button>
        </div>
      </Swiper>

      {/* Navigation Buttons */}
    </section>
  );
}
