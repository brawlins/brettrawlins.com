"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { allPosts } from "contentlayer/generated";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Static pages to search
  const staticPages = [
    {
      title: "About",
      url: "/about",
      excerpt: "Learn more about Brett Rawlins, full-stack software engineer",
      content:
        "brett rawlins full-stack software engineer web technologies learning building",
    },
  ];

  // Combine posts and static pages for search
  const searchableContent = [
    ...allPosts
      .filter(post => post.published !== false)
      .map(post => ({
        title: post.title,
        url: post.url,
        excerpt: post.excerpt || "",
        content: `${post.title} ${post.excerpt || ""} ${
          post.tags?.join(" ") || ""
        }`.toLowerCase(),
        type: "post",
        date: post.formattedDate,
      })),
    ...staticPages.map(page => ({
      ...page,
      type: "page",
      content: page.content.toLowerCase(),
    })),
  ];

  // Search function
  const performSearch = searchQuery => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const searchResults = searchableContent
      .filter(
        item =>
          item.content.includes(query) ||
          item.title.toLowerCase().includes(query)
      )
      .slice(0, 8); // Limit to 8 results

    setResults(searchResults);
  };

  // Handle input change
  const handleInputChange = e => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
    setIsOpen(value.length > 0);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = e => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Handle result click
  const handleResultClick = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          className="w-64 px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <svg
          className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${index}`}
                  href={result.url}
                  onClick={handleResultClick}
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {result.title}
                      </h4>
                      {result.excerpt && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {result.excerpt}
                        </p>
                      )}
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full mr-2">
                          {result.type === "post" ? "Post" : "Page"}
                        </span>
                        {result.date && <span>{result.date}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <svg
                className="mx-auto w-6 h-6 mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-sm">
                No results found for &quot;{query}&quot;
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
