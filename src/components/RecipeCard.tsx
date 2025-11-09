"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

interface RecipeCardProps {
  id?: number;
  title: string;
  image: string | any;
  date: string;
  author: string;
  category?: string;
  large?: boolean;
}

const RecipeCard = ({ id, title, image, date, author, category, large = false }: RecipeCardProps) => {
  const content = (
    <>
      <div className={`overflow-hidden rounded-lg mb-4 ${large ? "aspect-[16/10]" : "aspect-square"}`}>
        <Image
          src={image}
          alt={title}
          width={large ? 800 : 400}
          height={large ? 500 : 400}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="space-y-2">
        {category && (
          <span className="text-xs font-semibold text-accent uppercase tracking-wide">
            {category}
          </span>
        )}
        
        <h3 className={`font-bold group-hover:text-accent transition-colors ${large ? "text-2xl" : "text-lg"}`}>
          {title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time>{date}</time>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{author}</span>
          </div>
        </div>
      </div>
    </>
  );

  if (id) {
    return (
      <Link href={`/blog/${id}`} className="group cursor-pointer block">
        <article>{content}</article>
      </Link>
    );
  }

  return (
    <article className="group cursor-pointer">
      {content}
    </article>
  );
};

export default RecipeCard;
