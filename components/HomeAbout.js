import collection from "../collection.config.js";

// The archive's description beside a turning sphere of particles, ringed by
// the curator's name the way a label circles the centre of a record.
export default function HomeAbout() {
  const ring = `Curated by ${collection.curator} · Phnom Penh, Cambodia · `;
  return (
    <>
      <section id="about" className="home-screen home-statement" data-shape="word">
        <p className="statement statement-left english-text">{collection.description}</p>
      </section>
      <section className="home-screen home-orbit" data-shape="sphere">
        <svg className="orbit-ring" viewBox="0 0 600 600" aria-hidden="true">
          <defs>
            <path id="orbit-path" d="M300,300 m-262,0 a262,262 0 1,1 524,0 a262,262 0 1,1 -524,0" />
          </defs>
          <text>
            <textPath href="#orbit-path">{ring.repeat(2)}</textPath>
          </text>
        </svg>
        <p className="visually-hidden">Curated by {collection.curator}.</p>
      </section>
    </>
  );
}
