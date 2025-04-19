"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { useBlogs } from "@explore/lib/useBlogs";
import Image from "next/image";
import clsx from "clsx";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import BlogContent from "./BlogCard";

export default function FeaturedSlider() {
  const { blogsQuery } = useBlogs();
  const blogs = blogsQuery.data?.blogs || [];

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!blogs.length) return null;

  return (
    <div className="relative w-full h-[500px]  rounded-3xl overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        effect="fade"
        speed={800}
        autoplay={{ delay: 3000 }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{ clickable: true }}
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
            <BlogContent blog={blog} type={"slider"} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <div className="absolute bottom-10 left-6 z-20 flex  hidden md:flex items-center gap-3">
        <button
          ref={prevRef}
          disabled={isBeginning}
          className={clsx(
            "w-10 h-10 bg-white border border-white/30 rounded-full shadow-md flex items-center justify-center transition hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-800",
            isBeginning && "opacity-50 cursor-not-allowed",
          )}
        >
          <Image
            src="/icons/arrow-right.svg"
            alt="Previous"
            width={40}
            height={40}
            className="pointer-events-none dark:hidden"
          />
          <Image
            src="/icons/dark-arrow-right.svg"
            alt="Previous Dark"
            width={40}
            height={40}
            className="pointer-events-none hidden dark:block"
          />
        </button>

        <button
          ref={nextRef}
          disabled={isEnd}
          className={clsx(
            "w-10 h-10 bg-white border border-white/30 rounded-full shadow-md flex items-center justify-center transition hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-800",
            isEnd && "opacity-50 cursor-not-allowed",
          )}
        >
          <Image
            src="/icons/arrow-left.svg"
            alt="Next"
            width={40}
            height={40}
            className="pointer-events-none dark:hidden"
          />
          <Image
            src="/icons/dark-arrow-left.svg"
            alt="Next Dark"
            width={40}
            height={40}
            className="pointer-events-none hidden dark:block"
          />
        </button>
      </div>
    </div>
  );
}
