// Previous / page numbers / Next under the collection grid.
export default function CollectionPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav className="archive-pagination" aria-label="Pagination">
      <button type="button" className="archive-page-button" onClick={() => onChange(page - 1)} disabled={page === 1}>
        Previous
      </button>
      {pages.map((number) => (
        <button
          type="button"
          key={number}
          className={`archive-page-button ${number === page ? "is-active" : ""}`}
          onClick={() => onChange(number)}
          aria-current={number === page ? "page" : undefined}
        >
          {number}
        </button>
      ))}
      <button type="button" className="archive-page-button" onClick={() => onChange(page + 1)} disabled={page === totalPages}>
        Next
      </button>
    </nav>
  );
}
