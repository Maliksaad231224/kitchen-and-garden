"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string | any;
  className?: string;
}

const CategoryCard = ({ title, subtitle, description, image, className }: CategoryCardProps) => {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-lg bg-card border border-border hover-scale cursor-pointer",
      className
    )}>
      <div className="aspect-square overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={400}
          height={400}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">{title}</h3>
        <p className="text-xs md:text-sm font-semibold text-accent mb-2 md:mb-3">{subtitle}</p>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
