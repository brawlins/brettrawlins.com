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
                className="inline-block px-4 py-2 bg-gray-800 rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-700 transition-all duration-200 text-gray-200 hover:text-blue-400 text-sm font-medium border border-gray-700"
              >
                {tag}
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}
