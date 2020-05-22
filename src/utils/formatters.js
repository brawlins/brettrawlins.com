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

/**
 * Returns the singular or plural form based on the given number
 *
 * @param {Number} number - number
 * @param {String} singular - the singular form of the word
 * @param {String} plural - the plural form of the word
 * @returns {String}
 */
function pluralize(number, singular, plural = null) {
  // Define the default plural ending
  let pluralEnding = 's';
  // Handle notable exceptions
  if (/(s|x|z)$/.test(singular) || /(ch|sh)$/.test(singular)) {
    pluralEnding = 'es';
  }
  // If plural given, use it, otherwise add pluralEnding
  plural = plural || singular + pluralEnding;

  // Exit early if not a number
  if (isNaN(number) === true) {
    return '';
  }

  // Convert number string to number
  number = Number(number);

  // Return the correct form
  return number === 1 ? singular : plural;
}

module.exports = { toSlug, formatDate, getPathToPost, pluralize }
