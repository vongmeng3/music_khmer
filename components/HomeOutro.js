import Link from "next/link";
import collection from "../collection.config.js";

// The closing screens: a spiral "still collecting", the contribute call inside
// a chalk frame of particles, and a one-line footer.
export default function HomeOutro() {
  return (
    <>
      <section className="home-screen home-statement" data-shape="spiral">
        <p className="statement statement-left">
          <span className="english-text">And still collecting plenty more.</span>
          <span className="khmer-text side-sub">ហើយនៅតែប្រមូលបន្ថែមទៀត។</span>
        </p>
      </section>
      <section className="home-screen home-contact" data-shape="frame">
        <div className="contact-box">
          <p className="micro-label">Contribute / ចូលរួមចំណែក</p>
          <Link href="/contribute" className="contact-link">Add a song or instrument</Link>
          <p className="contact-sub">
            or <Link href="/login">log in</Link> to see your entries
          </p>
        </div>
      </section>
      <footer className="site-footer">
        <span>{collection.curator} — © 2026 — ICT 340, American University of Phnom Penh</span>
        <span>Every entry credits its contributor and place</span>
      </footer>
    </>
  );
}
