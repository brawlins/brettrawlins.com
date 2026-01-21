import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useMDXComponent } from "next-contentlayer2/hooks";
import { allPosts } from "contentlayer/generated";
import { createSlug } from "@/lib/utils";

export default function PostPage({ params }) {
  const post = allPosts.find(post => post.slug === params.slug);
  const MDXContent = useMDXComponent(post.body.code);

  return (
    <>
      <Head>
        <title>{post.title} - My Blog</title>
        <meta
          name="description"
          content={post.excerpt || `Read ${post.title}`}
        />
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.excerpt || `Read ${post.title}`}
        />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="bg-gray-900 min-h-screen">
        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Back to posts link */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width={20}
                height={20}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to posts
            </Link>
          </div>

          {/* Post header */}
          <header className="mb-8 pb-8 border-b border-gray-700">
            {post.image && (
              <div className="aspect-video relative overflow-hidden rounded-lg mb-8">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              <time dateTime={post.date} className="text-sm">
                Published on {post.formattedDate}
              </time>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/tags/${createSlug(tag.toLowerCase())}`}
                      className="inline-block bg-blue-900/50 text-blue-300 text-sm px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-200 border border-blue-800/30 hover:border-blue-500"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Post content */}
          <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-a:text-blue-400 prose-code:text-pink-300 prose-code:bg-gray-800 prose-pre:bg-gray-800 prose-blockquote:text-gray-300 prose-blockquote:border-gray-600">
            <MDXContent />
          </div>
        </article>
      </div>
    </>
  );
}
