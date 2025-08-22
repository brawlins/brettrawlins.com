import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import { format, parseISO } from "date-fns";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import removeMd from "remove-markdown";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.{md,mdx}`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true,
    },
    excerpt: {
      type: "string",
      description: "A short description of the post",
      required: false,
    },
    tags: {
      type: "list",
      of: { type: "string" },
      description: "Tags for the post",
      required: false,
    },
    published: {
      type: "boolean",
      description: "Whether the post is published",
      required: false,
      default: true,
    },
    image: {
      type: "string",
      description: "Featured image for the post",
      required: false,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: post => `/blog/${post._raw.flattenedPath}`,
    },
    slug: {
      type: "string",
      resolve: post => post._raw.flattenedPath,
    },
    formattedDate: {
      type: "string",
      resolve: post => format(parseISO(post.date), "LLLL d, yyyy"),
    },
    excerpt: {
      type: "string",
      resolve: post => {
        const plainText = removeMd(post.body.raw);
        return createWordBoundaryExcerpt(plainText.trim(), 120);
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "./content/posts",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [
      [
        rehypePrismPlus,
        {
          ignoreMissing: true,
          showLineNumbers: true,
        },
      ],
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});

function createWordBoundaryExcerpt(text, maxLength = 100) {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex === -1) {
    return truncated + "...";
  }

  return truncated.slice(0, lastSpaceIndex) + "...";
}
