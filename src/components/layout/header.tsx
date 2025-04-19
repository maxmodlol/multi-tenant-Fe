"use client";

import React, { useEffect, useState } from "react";
import { Menu, Moon, Search, X } from "lucide-react";
import { Button } from "@explore/components/ui/button";
import ResponsiveMenu from "./ResponsiveMenu";
import Link from "next/link";
import SearchOverlay from "@explore/components/SearchOverlay"; // ✅ Added

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // ✅ Added
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  if (!mounted) return null;

  return (
    <>
      {/* Header */}
      <header
        className="fixed top-0 right-0 z-50 flex h-[70px] w-full items-center px-4 md:px-8 lg:px-12 
        bg-brand-50 text-brand-500 shadow-md dark:bg-gray-900 dark:text-white"
      >
        <div className="flex items-center ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="p-0 hover:bg-transparent"
            onClick={toggleMenu}
          >
            {menuOpen ? (
              <X
                className="!size-5 text-brand-500 dark:text-white"
                stroke={isDark ? "white" : "currentColor"}
              />
            ) : (
              <Menu
                className="!size-5 text-brand-500 dark:text-white"
                stroke={isDark ? "white" : "currentColor"}
              />
            )}
          </Button>
        </div>

        {/* Center Logo */}
        <div
          className={`flex-1 ${
            isMobile
              ? "flex justify-end"
              : "absolute left-1/2 transform -translate-x-1/2 flex justify-center"
          }`}
        >
          <Link href="/">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto object-contain cursor-pointer" />
          </Link>
        </div>

        {/* Desktop: Theme toggle + Search */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="p-0 hover:bg-transparent"
              onClick={toggleDarkMode}
            >
              <Moon
                fill={isDark ? "white" : "none"}
                stroke={isDark ? "white" : "currentColor"}
                className="!size-5 text-brand-500 dark:text-white"
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="p-0 hover:bg-transparent"
              onClick={() => setSearchOpen(true)} // ✅ Opens overlay
            >
              <Search
                className="!size-5 text-brand-500 dark:text-white"
                stroke={isDark ? "white" : "currentColor"}
              />
            </Button>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && isMobile && (
        <div className="fixed inset-0 bg-brand-50 dark:bg-gray-900 z-50 flex flex-col mt-14 p-4 md:hidden">
          <ResponsiveMenu
            isMobile
            isDark={isDark}
            toggleDarkMode={toggleDarkMode}
            closeMenu={closeMenu}
          />
        </div>
      )}

      {/* Desktop Dropdown Menu */}
      {menuOpen && !isMobile && (
        <div className="hidden md:block absolute top-[70px] right-1 z-50 bg-brand-50 dark:bg-gray-900 shadow-md rounded-md p-6 w-72">
          <ResponsiveMenu
            isMobile={isMobile}
            isDark={isDark}
            toggleDarkMode={toggleDarkMode}
            closeMenu={closeMenu}
          />
        </div>
      )}

      {/* ✅ Search Overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
};

export default Header;
