// Empty state: say what was searched and what to try next, in both languages.
export default function CollectionEmpty({ query }) {
  return (
    <div className="collection-note" role="status">
      <p className="english-text" style={{ margin: 0 }}>
        {query
          ? `Nothing in the archive matches “${query}”. Try another word in Khmer or English, or clear the search.`
          : "No entries have been published yet."}
      </p>
      <p className="khmer-text" style={{ margin: "6px 0 0" }}>
        {query
          ? `រកមិនឃើញអ្វីដែលត្រូវនឹង «${query}» ទេ។ សូមសាកល្បងពាក្យផ្សេងទៀតជាភាសាខ្មែរ ឬអង់គ្លេស ឬសម្អាតការស្វែងរក។`
          : "មិនទាន់មានការចូលរួមណាមួយត្រូវបានផ្សព្វផ្សាយនៅឡើយទេ។"}
      </p>
    </div>
  );
}
