"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-creative";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Autoplay,
  EffectCreative, // ← import the effect
} from "swiper/modules";

import { useBlogs } from "@/src/hooks/public/useBlogs";
import BlogContent from "./BlogCard";
import { Blog } from "@explore/types/blogs";
import { Button } from "./ui/button";
import Image from "next/image";
import clsx from "clsx";

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
  /* seed React-Query so it never re-fetches on mount */
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
    <div className="relative w-full h-[500px] rounded-3xl overflow-hidden">
      <Swiper
        modules={[Navigation, Autoplay, EffectCreative]}
        slidesPerView={1}
        effect="creative"
        creativeEffect={{
          prev: { translate: ["-20%", 0, -1] },
          next: { translate: ["100%", 0, 0] },
        }}
        speed={800}
        autoplay={{ delay: 3000 }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onSwiper={(swiper) => {
          swiper.navigation.init();
          swiper.navigation.update();
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        className="w-full h-full"
      >
        {blogs.map((blog) => (
          <SwiperSlide key={blog.id}>
            <BlogContent blog={blog} type="slider" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <div className="absolute bottom-10 left-6 z-20 hidden md:flex items-center gap-3">
        <Button
          ref={prevRef}
          variant="outline"
          disabled={isBeginning}
          aria-label="الشريحة السابقة"
          className={clsx(
            "w-10 h-10 rounded-full bg-white border border-white/30 shadow-md flex items-center justify-center transition dark:bg-black",
            isBeginning && "opacity-50 cursor-not-allowed",
          )}
        >
          <Image
            src="/icons/arrow-right.svg"
            alt=""
            width={40}
            height={40}
            aria-hidden
            className="dark:hidden pointer-events-none"
          />
          <Image
            src="/icons/dark-arrow-right.svg"
            alt=""
            width={40}
            height={40}
            aria-hidden
            className="hidden dark:block pointer-events-none"
          />
        </Button>

        <Button
          ref={nextRef}
          variant="outline"
          disabled={isEnd}
          aria-label="الشريحة التالية"
          className={clsx(
            "w-10 h-10 rounded-full bg-white border border-white/30 shadow-md flex items-center justify-center transition dark:bg-black",
            isEnd && "opacity-50 cursor-not-allowed",
          )}
        >
          <Image
            src="/icons/arrow-left.svg"
            alt=""
            width={40}
            height={40}
            aria-hidden
            className="dark:hidden pointer-events-none"
          />
          <Image
            src="/icons/dark-arrow-left.svg"
            alt=""
            width={40}
            height={40}
            aria-hidden
            className="hidden dark:block pointer-events-none"
          />
        </Button>
      </div>
    </div>
  );
}
