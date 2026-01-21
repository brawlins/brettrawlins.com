"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createSlug } from "@/lib/utils";

export default function PostCard({ post }) {
  const router = useRouter();

  const handleCardClick = e => {
    // Don't navigate if clicking on a link (tag)
    if (e.target.tagName === "A" || e.target.closest("a")) {
      return;
    }
    router.push(post.url);
  };

  return (
    <article className="group cursor-pointer" onClick={handleCardClick}>
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-300 border border-gray-700 hover:border-blue-500 hover:-translate-y-1">
        {post.image && (
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <time dateTime={post.date}>{post.formattedDate}</time>
          </div>

          <h2 className="text-xl font-bold text-white mb-3">{post.title}</h2>

          {post.excerpt && (
            <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map(tag => (
                <Link
                  key={tag}
                  href={`/tags/${createSlug(tag.toLowerCase())}`}
                  className="inline-block bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-200 border border-blue-800/30 hover:border-blue-500 relative z-10"
                >
                  {tag}
                </Link>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
