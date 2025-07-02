// -----------------------------------------------------------------------------
// FeaturedSlider.tsx – EXACT match to provided Figma reference
// -----------------------------------------------------------------------------

"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-creative";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCreative } from "swiper/modules";
import { useRef, useState } from "react";
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

  if (!blogs.length) return null;

  return (
    <section className="relative w-full sm:h-[500px] rounded-3xl overflow-hidden">
      <Swiper
        modules={[Navigation, Autoplay, EffectCreative]}
        slidesPerView={1}
        effect="creative"
        creativeEffect={{
          prev: { translate: ["-20%", 0, -1] },
          next: { translate: ["100%", 0, 0] },
        }}
        speed={800}
        autoplay={{ delay: 4000 }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onSwiper={(s) => {
          s.navigation.init();
          s.navigation.update();
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
          <SwiperSlide key={blog.id} className="select-none">
            {/* use BlogCard with `slider` type so we get the exact overlay */}

            <BlogCard blog={blog} type="slider" />
          </SwiperSlide>
        ))}
        <div className="absolute bottom-4 left-6 z-20 flex items-center gap-4">
          <Button
            ref={prevRef}
            variant="ghost"
            size="icon"
            disabled={isBeginning}
            aria-label="السابق"
            className={clsx(
              "h-12 w-12 rounded-full bg-white text-black shadow-md",
              "flex items-center justify-center transition-all active:scale-95",
              isBeginning && "opacity-50 cursor-not-allowed",
            )}
          >
            <Image src="/icons/arrow-right.svg" alt="prev" width={28} height={28} />
          </Button>
          <Button
            ref={nextRef}
            variant="ghost"
            size="icon"
            disabled={isEnd}
            aria-label="التالي"
            className={clsx(
              "h-13 w-13 rounded-full bg-white text-black shadow-md",
              "flex items-center justify-center transition-all active:scale-95",
              isEnd && "opacity-50 cursor-not-allowed",
            )}
          >
            <Image src="/icons/arrow-left.svg" alt="next" width={28} height={28} />
          </Button>
        </div>
      </Swiper>

      {/* Navigation Buttons */}
    </section>
  );
}
