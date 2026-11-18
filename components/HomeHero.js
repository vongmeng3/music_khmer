import collection from "../collection.config.js";

// First screen. The particles spell តន្ត្រី ("music") behind two quiet labels,
// one on each side, the way a record sleeve leaves the art to speak.
export default function HomeHero() {
  return (
    <section className="home-screen home-hero" data-shape="word">
      <h1 className="side-label side-left">
        <span className="english-text">{collection.name}</span>
        <span className="khmer-title side-sub">{collection.nameKh}</span>
      </h1>
      <p className="side-label side-right">
        <span>Khmer Living Archive</span>
        <span className="khmer-text side-sub">បណ្ណសាររស់រវើកខ្មែរ</span>
      </p>
      <p className="scroll-hint" aria-hidden="true">Scroll to listen</p>
    </section>
  );
}
