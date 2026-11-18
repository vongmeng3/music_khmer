import Link from "next/link";

// One entry in the collection grid: photo, type, Khmer and English titles,
// tags, a short description and where it came from. Styles: app/globals.css.
export default function EntryCard({
  titleEn,
  titleKh,
  descriptionEn,
  descriptionKh,
  contributorEn,
  contributorKh,
  placeEn,
  placeKh,
  type,
  image,
  href,
  highlight,
  tags = [],
}) {
  const mark = highlight || ((value) => value);
  return (
    <Link href={href} className="archive-card">
      <span className="archive-card-media">
        {image ? (
          <img className="archive-card-image" src={image} alt={titleEn} loading="lazy" decoding="async" />
        ) : (
          <span className="archive-card-image archive-image-placeholder" role="img" aria-label={`${titleEn} image update soon`}>
            Update soon
          </span>
        )}
      </span>
      <span className="archive-card-top">
        <span className="micro-label">{type === "song" ? "Song / ចម្រៀង" : "Instrument / ឧបករណ៍"}</span>
        <span className="archive-card-arrow" aria-hidden="true">↗</span>
      </span>
      <h3 className="archive-card-title">
        <span className="khmer-title">{mark(titleKh)}</span>
        <span className="english-text">{mark(titleEn)}</span>
      </h3>
      {Array.isArray(tags) && tags.length > 0 && (
        <span className="archive-card-tags" aria-label="Keywords">
          {tags.map((tag) => <span key={tag}>{mark(tag)}</span>)}
        </span>
      )}
      <span className="archive-card-description">
        <span className="khmer-text">{mark(descriptionKh)}</span>
        <span className="english-text">{mark(descriptionEn)}</span>
      </span>
      <span className="archive-card-meta">
        <span><span className="khmer-contributor">{contributorKh}</span> / {contributorEn}</span>
        <span><span className="khmer-place">{placeKh}</span> / {placeEn}</span>
      </span>
    </Link>
  );
}
