import { allPosts } from "contentlayer/generated";
import Link from "next/link";
import { createSlug } from "@/lib/utils";

export default function AllTagsPage() {
  const tags = new Set();
  allPosts.forEach(post => {
    if (post.tags) post.tags.forEach(tag => tags.add(tag.toLowerCase()));
  });

  return (
    <section className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">All Tags</h1>
      <ul className="flex flex-wrap gap-3">
        {Array.from(tags)
          .sort()
          .map(tag => (
            <li key={tag}>
              <Link
                href={`/tags/${createSlug(tag)}`}
                className="inline-block px-4 py-2 bg-blue-900/50 text-blue-300 rounded-full hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-200 border border-blue-800/30 hover:border-blue-500 text-sm font-medium"
              >
                {tag}
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}
