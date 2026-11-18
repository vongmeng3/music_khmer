"use client";

import { useEffect, useMemo, useState } from "react";
import { entryHref } from "../lib/entry-slugs.js";
import { highlight, matches } from "../lib/entry-search.js";
import CollectionPagination from "./CollectionPagination.js";
import CollectionSearch from "./CollectionSearch.js";
import CollectionEmpty from "./CollectionEmpty.js";
import EntryCard from "./EntryCard.js";

const PER_PAGE = 6;

// Browse and search every published entry, six per page.
export default function CollectionBrowser({ entries, isLoading, error }) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const [page, setPage] = useState(1);

  // Wait until typing stops before filtering, which is kinder to slow phones.
  useEffect(() => {
    const timer = window.setTimeout(() => { setSearched(query); setPage(1); }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const filtered = useMemo(() => entries.filter((entry) => matches(entry, searched)), [entries, searched]);
  const suggestions = [...new Set(entries.flatMap((entry) => entry.tags || []))].slice(0, 8);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  function goTo(next) {
    setPage(Math.min(totalPages, Math.max(1, next)));
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="collection" className="collection" data-shape="dust">
      <header className="collection-head">
        <div>
          <p className="micro-label">The collection / បណ្តុំ</p>
          <h2 className="collection-title">Every song and instrument</h2>
          {!isLoading && !error && filtered.length > 0 && (
            <p className="collection-count">
              Showing {Math.min(current * PER_PAGE, filtered.length)} of {filtered.length} entries
            </p>
          )}
        </div>
        <CollectionSearch query={query} suggestions={suggestions} onChange={setQuery} />
      </header>

      {isLoading && <p className="collection-note">Loading archive entries…</p>}
      {error && <p className="collection-note" role="alert">{error}</p>}
      {!isLoading && !error && filtered.length === 0 && <CollectionEmpty query={searched} />}

      {!isLoading && !error && (
        <div className="archive-entry-grid">
          {shown.map((entry) => (
            <EntryCard
              key={entry.id}
              {...entry}
              href={`${entryHref(entry)}${searched ? `?q=${encodeURIComponent(searched)}` : ""}`}
              highlight={(value) => highlight(value, searched)}
            />
          ))}
        </div>
      )}
      <CollectionPagination page={current} totalPages={totalPages} onChange={goTo} />
    </section>
  );
}
