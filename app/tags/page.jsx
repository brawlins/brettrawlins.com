import { allPosts } from "contentlayer/generated";
import Link from "next/link";

export default function AllTagsPage() {
  const tags = new Set();
  allPosts.forEach(post => {
    if (post.tags) post.tags.forEach(tag => tags.add(tag.toLowerCase()));
  });

  return (
    <section className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Tags</h1>
      <ul className="flex flex-wrap gap-3">
        {Array.from(tags)
          .sort()
          .map(tag => (
            <li key={tag}>
              <Link
                href={`/tags/${tag}`}
                className="inline-block px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-gray-800 hover:text-blue-600 text-sm font-medium capitalize"
              >
                {tag}
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}
