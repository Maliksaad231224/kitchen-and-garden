"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import RecipeCard from "./RecipeCard";
import { Button } from "@/components/ui/button";

interface BlogSearchProps {
  posts: Array<{
    id: number;
    title: string;
    excerpt: string | null;
    content: string | null;
    image: string | null;
    author: string | null;
    created_at: string;
  }>;
}

export default function BlogSearch({ posts }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [urlSearchQuery, setUrlSearchQuery] = useState("");

  // Get search query from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || "";
      setUrlSearchQuery(q);
      setSearchQuery(q);
    }
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    setUrlSearchQuery("");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("q");
      window.history.pushState({}, "", url.toString());
    }
  };

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    const query = (searchQuery || urlSearchQuery).trim();
    if (!query) {
      return posts;
    }

    const searchTerm = query.toLowerCase();
    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(searchTerm);
      const excerptMatch = post.excerpt?.toLowerCase().includes(searchTerm);
      const contentMatch = post.content?.toLowerCase().includes(searchTerm);
      const authorMatch = post.author?.toLowerCase().includes(searchTerm);

      return titleMatch || excerptMatch || contentMatch || authorMatch;
    });
  }, [posts, searchQuery, urlSearchQuery]);

  const currentSearchQuery = searchQuery || urlSearchQuery;
  const latestRecipes = filteredPosts.slice(0, 3);
  const topRecipes = filteredPosts.slice(3);

  return (
    <div>
      {/* Results */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-24">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-8">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <h3 className="text-3xl font-light text-gray-900 mb-6">No recipes found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            {currentSearchQuery 
              ? `We couldn't find any recipes matching "${currentSearchQuery}". Try a different search or browse our collection below.`
              : "Looks like this recipe might be hiding from us. Try a different search or browse our collection below."
            }
          </p>
          {currentSearchQuery && (
            <Button
              onClick={clearSearch}
              variant="outline"
              size="lg"
              className="text-red-500 border-red-500 hover:bg-red-50"
            >
              Browse All Recipes
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Latest Recipes Section */}
          {currentSearchQuery === "" ? (
            <section className="mb-24">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">Fresh from Our Kitchen</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                  These are the recipes that just came out of our testing kitchen. Each one has been 
                  perfected through multiple trials to ensure your success in your own kitchen.
                </p>
              </div>

              {latestRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {latestRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      id={recipe.id}
                      title={recipe.title}
                      image={recipe.image || "/hero-lavender-cocktail.jpg"}
                      date={new Date(recipe.created_at).toLocaleDateString()}
                      author={recipe.author || "Kitchen & Garden"}
                      category={recipe.excerpt || "Recipe"}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">The kitchen is quiet right now. Check back soon for new recipes!</p>
                </div>
              )}
            </section>
          ) : null}

          {/* Search Results Section */}
          {currentSearchQuery !== "" ? (
            <section>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
                  Search Results
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  We found <span className="font-medium text-red-500">{filteredPosts.length}</span> recipe{filteredPosts.length !== 1 ? "s" : ""} that match "{currentSearchQuery}". 
                  Each one has been tested in our kitchen to ensure it works perfectly for you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    id={recipe.id}
                    title={recipe.title}
                    image={recipe.image || "/hero-lavender-cocktail.jpg"}
                    date={new Date(recipe.created_at).toLocaleDateString()}
                    author={recipe.author || "Kitchen & Garden"}
                    category={recipe.excerpt || "Recipe"}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {/* More Recipes Section */}
          {currentSearchQuery === "" && topRecipes.length > 0 && (
            <section className="mt-24">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">More to Explore</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  These recipes have been making waves in home kitchens. From quick weeknight 
                  heroes to weekend project masterpieces, there's something here for every cook.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {topRecipes.map((recipe, index) => (
                  <RecipeCard
                    key={recipe.id}
                    id={recipe.id}
                    title={recipe.title}
                    image={recipe.image || "/hero-lavender-cocktail.jpg"}
                    date={new Date(recipe.created_at).toLocaleDateString()}
                    author={recipe.author || "Kitchen & Garden"}
                    category={recipe.excerpt || "Recipe"}
                    large={index === 0}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
