export function createSlug(text) {
  return text.trim().toLowerCase().replace(/\s+/g, "-");
}
