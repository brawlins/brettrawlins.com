function toSlug(title) {
  let slug = ""
  if (title) {
    slug = title
      .toLowerCase()
      // Separate words with hyphens
      .replace(/\s+/g, "-")
      // Remove unwanted characters
      .replace(/[^\w-]/g, "")
  }
  return slug
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString))
}

function getPathToPost(title) {
  return '/blog/' + toSlug(title)
}

module.exports = { toSlug, formatDate, getPathToPost }
