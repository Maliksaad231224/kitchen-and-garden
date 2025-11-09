"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
      <div className="container mx-auto px-4 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 h-full items-center">
          {/* Left side - Image */}
          <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] order-2 lg:order-1">
            <Image
              src="/hero-lavender-cocktail.jpg"
              alt="Lavender Prosecco Cocktail"
              fill
              className="w-full h-full object-cover rounded-lg shadow-2xl"
              priority
            />
          </div>

          {/* Right side - Text Content */}
          <div className="flex flex-col justify-center space-y-4 md:space-y-6 order-1 lg:order-2">
            <div className="inline-block px-3 py-1 md:px-4 md:py-2 bg-accent text-accent-foreground rounded-full text-xs md:text-sm font-semibold w-fit">
              Featured Recipe
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Lavender Lemonade <br />
              <span className="text-red-400">Prosecco Cocktail</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
              Made with lavender simple syrup, fresh lemonade, and chilled prosecco, this sparkling drink is a gorgeous twist on classic summer cocktails. You'll love how the flavors blend with the floral undertone.
            </p>

            <div className="pt-2 md:pt-4">
              <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white group text-sm md:text-base">
                <Link href="/blog" className="inline-flex items-center">
                  Continue Reading
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
