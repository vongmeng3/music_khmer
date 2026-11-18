"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import collection from "../collection.config.js";
import { createClient } from "../lib/supabase/client.js";
import AccountMenu from "./AccountMenu.js";
import ReviewerNavLink from "./ReviewerNavLink.js";

// A quiet fixed bar: the archive name on the left, small links on the right.
// Shown on every page from app/layout.js.
export default function ArchiveNav() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (isMounted) setUser(currentUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function link(href, label) {
    const isActive = pathname === href;
    return (
      <Link className={`archive-nav-link ${isActive ? "is-active" : ""}`} href={href} aria-current={isActive ? "page" : undefined}>
        {label}
      </Link>
    );
  }

  return (
    <nav className="archive-nav" aria-label="Primary navigation">
      <Link className="archive-brand" href="/" aria-label={`${collection.name} home`}>
        <span className="khmer-title">{collection.nameKh}</span>
        <span className="archive-brand-name">{collection.name}</span>
      </Link>
      <div className="archive-nav-links">
        {link("/", "Archive")}
        <Link className="archive-nav-link" href="/#collection">Collection</Link>
        {link("/contribute", "Contribute")}
        {user && link("/my-entries", "My entries")}
        {user && <ReviewerNavLink userId={user.id} />}
        <AccountMenu user={user} onLogout={() => setUser(null)} />
      </div>
    </nav>
  );
}
