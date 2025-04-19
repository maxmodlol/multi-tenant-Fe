"use client";

import { Input } from "@explore/components/ui/input";
import { Button } from "@explore/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-brand-50  border border-gray-100 shadow-md dark:bg-gray-900 text-sm dark:border-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 py-10 md:px-16">
        {/* Top Section: Logo + Subscription */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <Image src="/logo.svg" alt="Logo" width={100} height={40} />
          </div>

          {/* Subscription */}
          <form className="flex flex-row items-center gap-2 md:gap-3 md:justify-end">
            <Input
              placeholder="ادخل ايميلك"
              className="min-w-[240px] md:min-w-[260px] dark:bg-transparent text-right"
            />
            <Button
              variant="secondaryGray"
              size="lg"
              className="!rounded-full !dark:!bg-background-brand "
            >
              اشترك
            </Button>
          </form>
        </div>

        {/* Middle Section: Navigation Links */}
        <div className="mt-6">
          {/* 
            On mobile (default): grid with 2 columns => 2 links per row.
            On md and above: switch to flex row.
          */}
          <ul
            className="
              grid grid-cols-2 gap-4 
              justify-items-center
              font-medium text-gray-700 dark:text-gray-300 text-base

              md:flex md:justify-start md:gap-8
            "
          >
            <li>
              <Link href="#">من نحن</Link>
            </li>
            <li>
              <Link href="#">أتصل بنا</Link>
            </li>
            <li>
              <Link href="#">سياسة الخصوصية</Link>
            </li>
            <li>
              <Link href="#">انضم الى الناشر</Link>
            </li>
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 text-brand-500 dark:text-gray-400 md:mt-10 flex flex-start text-center">
          © جميع الحقوق محفوظة لدى
        </div>
      </div>
    </footer>
  );
};

export default Footer;
