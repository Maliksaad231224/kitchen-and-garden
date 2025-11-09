"use client";

import { useState, useEffect } from "react";
import { Search, X, Clock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SearchResult {
  id: number;
  title: string;
  excerpt: string | null;
  image: string | null;
  author: string | null;
  created_at: string;
}

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch posts for search
  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const posts = await response.json();
        return posts;
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    return [];
  };

  const searchPosts = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const posts = await fetchPosts();
      const filtered = posts
        .filter((post: SearchResult) => {
          const titleMatch = post.title.toLowerCase().includes(query.toLowerCase());
          const excerptMatch = post.excerpt?.toLowerCase().includes(query.toLowerCase());
          const authorMatch = post.author?.toLowerCase().includes(query.toLowerCase());
          return titleMatch || excerptMatch || authorMatch;
        })
        .slice(0, 5); // Limit to 5 results

      setResults(filtered);
      setIsOpen(filtered.length > 0);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchPosts(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleResultClick = () => {
    clearSearch();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative search-container">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-400"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchQuery && !isLoading && (
            <Button
              onClick={clearSearch}
              variant="ghost"
              size="icon"
              className="h-4 w-4 text-gray-400 hover:text-white p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2 border-b border-gray-100">
                <p className="text-sm text-gray-600 px-2">
                  {results.length} result{results.length !== 1 ? "s" : ""} for "{searchQuery}"
                </p>
              </div>
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/blog/${result.id}`}
                  onClick={handleResultClick}
                  className="block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    {result.image && (
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {result.title}
                      </h4>
                      {result.excerpt && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {result.excerpt}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        {result.author && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{result.author}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(result.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="p-2 border-t border-gray-100 bg-gray-50">
                <Link
                  href={`/blog?q=${encodeURIComponent(searchQuery)}`}
                  onClick={handleResultClick}
                  className="block text-center text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  View all results →
                </Link>
              </div>
            </>
          ) : searchQuery ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm">No recipes found for "{searchQuery}"</p>
              <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}