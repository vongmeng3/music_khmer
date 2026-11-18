import collection from "../collection.config.js";

// Where the knowledge comes from, set right-aligned over the sound-wave ribbon.
export default function HomeSource() {
  return (
    <section className="home-screen home-statement" data-shape="ribbon">
      <div className="statement statement-right">
        <p className="micro-label">Source / ប្រភព</p>
        <p className="archive-source">{collection.source}</p>
      </div>
    </section>
  );
}
