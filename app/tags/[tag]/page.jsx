import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";

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
  // Convert slug back to tag
  const tag = params.tag.replace(/-/g, " ");

  const taggedPosts = allPosts
    .filter(post => post.tags?.some(t => t.toLowerCase() === tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending

  if (taggedPosts.length === 0) {
    notFound(); // Or show a "No posts found" message
  }

  return (
    <section className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">
        Posts tagged with &quot;{tag}&quot;
      </h1>
      <div className="grid gap-8 md:grid-cols-2">
        {taggedPosts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
