"use client";

import Link from "next/link";
import Image from "next/image";
import { createSlug } from "@/lib/utils";

export default function PostCard({ post }) {
  return (
    <article className="group cursor-pointer">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <time dateTime={post.date}>{post.formattedDate}</time>
          </div>

          <Link href={post.url}>
            <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h2>
          </Link>

          {post.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map(tag => (
                <Link
                  key={tag}
                  href={`/tags/${createSlug(tag.toLowerCase())}`}
                  className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
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
