"use client";

import Link from "next/link";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold mb-8">
            Kitchen <span className="text-accent">&</span> Garden
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
          <Link href="#shop" className="hover:text-accent transition-colors">Shop</Link>
          <Link href="#privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
          <Link href="#cookie" className="hover:text-accent transition-colors">Cookie Policy</Link>
          <Link href="#terms" className="hover:text-accent transition-colors">Terms of Use</Link>
        </nav>

        {/* Social Media */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="hover:text-accent transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-accent transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-accent transition-colors">
            <MessageCircle className="h-6 w-6" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-primary-foreground/70">
          Copyright © 2025 | Kitchen & Garden
        </div>
      </div>
    </footer>
  );
};

export default Footer;
