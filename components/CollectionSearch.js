// The search box and the tag shortcuts above the collection grid.
export default function CollectionSearch({ query, suggestions, onChange }) {
  const shown = suggestions.filter((term) => !query || term.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return (
    <div className="archive-search-wrap">
      <label className="micro-label" htmlFor="archive-search">Search the archive / ស្វែងរក</label>
      <input
        className="archive-search-input"
        id="archive-search"
        type="search"
        placeholder="Music, instruments, places… ឧ. ចាប៉ី"
        value={query}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="archive-suggestions" aria-label="Related search terms">
        {shown.map((term) => (
          <button type="button" key={term} className="archive-suggestion" onClick={() => onChange(term)}>{term}</button>
        ))}
      </div>
    </div>
  );
}
