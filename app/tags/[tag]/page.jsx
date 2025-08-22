import { allPosts } from "contentlayer/generated";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const tags = new Set();

  allPosts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag.toLowerCase())); // Normalize tags
    }
  });

  return Array.from(tags).map(tag => ({ tag }));
}

export default function TagPage({ params }) {
  const tag = params.tag;
  const taggedPosts = allPosts
    .filter(post => post.tags?.some(t => t.toLowerCase() === tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending

  if (taggedPosts.length === 0) {
    notFound(); // Or show a "No posts found" message
  }

  return (
    <section className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 capitalize">
        Posts tagged with &quot;{tag}&quot;
      </h1>
      <ul className="space-y-4">
        {taggedPosts.map(post => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-xl font-semibold text-gray-800 hover:text-blue-600">
                {post.title}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {new Date(post.date).toLocaleDateString()}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
