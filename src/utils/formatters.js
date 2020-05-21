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

function formatDate(dateString, dateStyle = "long") {
  let formattingOptions = { dateStyle }
  return new Intl.DateTimeFormat("en-US", formattingOptions).format(
    new Date(dateString)
  )
}

function getPathToPost(title) {
  return "/blog/" + toSlug(title)
}

module.exports = { toSlug, formatDate, getPathToPost }
