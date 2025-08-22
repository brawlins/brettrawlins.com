"use client";

import Link from "next/link";
import { compareDesc } from "date-fns";
import { allPosts } from "contentlayer/generated";
import PostCard from "@/components/PostCard";

export default function HomePage() {
  // Filter only published posts, sort by date, and take most recent ones
  const recentPostsCount = 6;
  const recentPosts = allPosts
    .filter(post => post.published !== false)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, recentPostsCount);

  const totalPosts = allPosts.filter(post => post.published !== false).length;
  const hasMorePosts = totalPosts > recentPostsCount;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to My Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A full-stack software engineer&apos;s journey through web
          technologies, learning, and building new things.
        </p>
      </div>

      {/* Recent Posts Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recent Posts</h2>
          {hasMorePosts && (
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center"
            >
              View all posts
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {recentPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found.</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      {hasMorePosts && (
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Showing {recentPosts.length} of {totalPosts} posts
          </p>
          <Link
            href="/blog"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Browse All Posts
          </Link>
        </div>
      )}
    </div>
  );
}
