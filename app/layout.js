import collection from "../collection.config.js";
import ArchiveNav from "../components/ArchiveNav.js";
import ParticleField from "../components/ParticleField.js";
import "./globals.css";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ParticleField />
        <ArchiveNav />
        <div className="site-content">{children}</div>
      </body>
    </html>
  );
}
