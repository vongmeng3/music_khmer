// Search helpers for the Browse page. Normalising to NFC keeps Khmer letters
// intact while letting the same word typed two ways still match.

export function normalize(value) {
  return (value || "").normalize("NFC").toLocaleLowerCase();
}

// Search both language versions of every text field, the type and the tags.
export function matches(entry, query) {
  const q = normalize(query.trim());
  if (!q) return true; // empty query shows everything
  return [
    entry.titleEn,
    entry.titleKh,
    entry.descriptionEn,
    entry.descriptionKh,
    entry.placeEn,
    entry.placeKh,
    entry.contributorEn,
    entry.contributorKh,
    entry.type,
    ...(entry.tags || []),
  ].some((field) => normalize(field).includes(q));
}

export function highlight(value, query) {
  const text = value || "";
  const term = query.trim();
  if (!term) return text;
  const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return parts.map((part, index) =>
    part.toLocaleLowerCase() === term.toLocaleLowerCase() ? <mark key={index}>{part}</mark> : part,
  );
}

// Database rows use snake_case; the components read camelCase.
export function mapEntry(entry) {
  return {
    ...entry,
    title: entry.title_en,
    titleEn: entry.title_en,
    titleKh: entry.title_kh,
    descriptionEn: entry.description_en,
    descriptionKh: entry.description_kh,
    contributorEn: entry.contributor_en,
    contributorKh: entry.contributor_kh,
    placeEn: entry.place_en,
    placeKh: entry.place_kh,
    youtubeUrl: entry.youtube_url,
    youtubeId: entry.youtube_id,
  };
}
