"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, ShoppingCart, User } from "lucide-react";
import GlobalSearch from "./GlobalSearch";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50">
      <div className="w-full border-b border-gray-800 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Logo, Search, Account/Admin */}
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo/Name */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Image src="/logo.png" width={40} height={40} alt="Kitchen & Garden" className="rounded-sm object-contain" />
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
                  Kitchen <span className="text-red-400">&</span> Garden
                </div>
              </div>
            </Link>

            {/* Centered Search Bar */}
            <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 mx-4 max-w-sm xl:max-w-md">
              <GlobalSearch />
            </div>

            {/* Right side - Account Creation and Admin (hidden on mobile, hamburger shown) */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Mobile Search Toggle (hidden to show only hamburger on mobile) */}
              <Button
                variant="ghost"
                size="sm"
                aria-label="Search"
                className="hidden"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Cart - Desktop only */}
              <Button variant="ghost" size="sm" aria-label="Shopping Cart" className="hidden xl:flex h-8 w-8 p-0">
                <ShoppingCart className="h-4 w-4" />
              </Button>

              {/* Authentication - Sign up, Sign in, Admin (hide on small screens; mobile menu contains auth links) */}
              {!session ? (
                <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
                  <Link href="/signup">
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white border-0 font-medium text-xs sm:text-sm h-8 px-2 sm:px-4"
                    >
                      <span className="hidden xs:inline">Create Account</span>
                      <span className="xs:hidden">Sign Up</span>
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-red-300 hover:bg-gray-800 font-medium text-xs sm:text-sm h-8 px-2 sm:px-4"
                    >
                      <span className="hidden xs:inline">Sign In</span>
                      <span className="xs:hidden">Sign In</span>
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
                  {/* User Avatar/Name */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-300 max-w-20 truncate font-medium">
                      {session.user?.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-gray-300 hover:text-white hover:bg-gray-800 font-medium text-xs sm:text-sm h-8 px-2 sm:px-4"
                  >
                    <span className="hidden xs:inline">Sign Out</span>
                    <span className="xs:hidden">Out</span>
                  </Button>
                </div>
              )}

              {/* Admin Link (hidden on small screens) */}
              <div className="hidden md:block">
                <Link href="/admin/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-300 text-xs px-1 sm:px-2 py-1 h-8 font-medium"
                  >
                    <span className="hidden xs:inline">Admin</span>
                    <span className="xs:hidden">ADM</span>
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                aria-label="Toggle menu"
                className="md:hidden h-8 w-8 p-0"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Bottom Row: Navigation Menu */}
          <nav className="h-10 md:h-12 flex items-center justify-center space-x-4 md:space-x-8 border-t border-gray-800">
            <Link href="/" className="hover:text-red-300 transition-colors font-semibold text-xs md:text-sm">
              HOME
            </Link>
            <Link href="/blog" className="hover:text-red-300 transition-colors font-semibold text-xs md:text-sm">
              BLOG
            </Link>
            <Link href="#recipes" className="hover:text-red-300 transition-colors font-semibold text-xs md:text-sm">
              RECIPES
            </Link>
            <Link href="/about" className="hover:text-red-300 transition-colors font-semibold text-xs md:text-sm">
              ABOUT
            </Link>
          </nav>

          {/* Mobile Search Bar */}
          <div className="md:hidden py-3 border-t border-gray-800">
            <GlobalSearch />
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="hover:text-red-300 transition-colors font-semibold text-sm">
                  HOME
                </Link>
                <Link href="/blog" className="hover:text-red-300 transition-colors font-semibold text-sm">
                  BLOG
                </Link>
                <Link href="#recipes" className="hover:text-red-300 transition-colors font-semibold text-sm">
                  RECIPES
                </Link>
                <Link href="/about" className="hover:text-red-300 transition-colors font-semibold text-sm">
                  ABOUT
                </Link>
                
                {/* Mobile Auth */}
                <div className="pt-4 border-t border-gray-800">
                  {!session ? (
                    <div className="space-y-3">
                      <Link href="/signup" className="block text-white hover:text-red-300 transition-colors font-semibold text-sm">
                        CREATE ACCOUNT
                      </Link>
                      <Link href="/login" className="block text-white hover:text-red-300 transition-colors font-semibold text-sm">
                        SIGN IN
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white font-semibold text-sm">{session.user?.name}</span>
                      </div>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block text-white hover:text-red-300 transition-colors font-semibold text-sm"
                      >
                        SIGN OUT
                      </button>
                    </div>
                  )}
                  {/* Mobile Admin link - visible inside mobile menu for quick admin access */}
                  <div className="pt-3">
                    <Link href="/admin/login" className="block text-white hover:text-red-300 transition-colors font-semibold text-sm">
                      ADMIN
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
