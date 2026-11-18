"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";

// The small account button at the end of the nav: log in / sign up, or the
// signed-in email and a log out button.
export default function AccountMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await createClient().auth.signOut();
    onLogout();
    setIsOpen(false);
    setIsLoggingOut(false);
  }

  return (
    <div className="account-menu">
      <button
        type="button"
        className="archive-nav-link account-button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Account menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {user ? "Account" : "Log in"}
      </button>
      {isOpen && (
        <div className="account-dropdown" role="menu">
          {user ? (
            <>
              <span className="account-email" title={user.email}>{user.email}</span>
              <button type="button" className="account-item" onClick={handleLogout} disabled={isLoggingOut} role="menuitem">
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="account-item" role="menuitem" onClick={() => setIsOpen(false)}>Log in</Link>
              <Link href="/signup" className="account-item" role="menuitem" onClick={() => setIsOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
