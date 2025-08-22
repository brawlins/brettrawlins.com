"use client";

import { compareDesc } from "date-fns";
import { allPosts } from "contentlayer/generated";
import PostCard from "@/components/PostCard";

export default function PostsPage() {
  // Filter only published posts and sort by date
  const posts = allPosts
    .filter(post => post.published !== false)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-white">All Posts</h1>
          <span className="text-lg text-gray-400">({posts.length})</span>
        </div>
        <p className="text-lg text-gray-300">
          Discover insights, tutorials, and thoughts on web development
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No posts found.</p>
        </div>
      )}
    </section>
  );
}
