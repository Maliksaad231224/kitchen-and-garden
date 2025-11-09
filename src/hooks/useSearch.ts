"use client";

import { useState, useEffect, useMemo } from "react";

interface SearchResult {
  id: number;
  title: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  author: string | null;
  created_at: string;
}

export const useSearch = (posts: SearchResult[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    return posts
      .filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const excerptMatch = post.excerpt?.toLowerCase().includes(query);
        const contentMatch = post.content?.toLowerCase().includes(query);
        const authorMatch = post.author?.toLowerCase().includes(query);

        return titleMatch || excerptMatch || contentMatch || authorMatch;
      })
      .slice(0, 5); // Limit to 5 results for dropdown
  }, [posts, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsOpen(query.length > 0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsOpen(false);
  };

  const closeDropdown = () => {
    setIsOpen(false);
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

  return {
    searchQuery,
    filteredPosts,
    isOpen,
    handleSearch,
    clearSearch,
    closeDropdown,
    setIsOpen,
  };
};