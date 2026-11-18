"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import collection from "../collection.config.js";
import { createClient } from "../lib/supabase/client.js";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "110px 16px 48px",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    padding: 32,
    background: "rgba(34, 33, 36, 0.88)",
    border: "1px solid rgba(240, 242, 240, 0.14)",
    borderRadius: 10,
    backdropFilter: "blur(6px)",
  },
  kicker: { color: "#9A989F", fontFamily: "'Inter Tight', sans-serif", fontSize: 11, letterSpacing: "0.08em" },
  title: { margin: "14px 0 8px", color: "#F0F2F0", fontSize: 36, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15 },
  description: { margin: "0 0 28px", color: "#9A989F", lineHeight: 1.6 },
  label: { display: "block", margin: "16px 0 8px", color: "#9A989F", fontFamily: "'Inter Tight', sans-serif", fontSize: 12, letterSpacing: 0.8 },
  input: { width: "100%", boxSizing: "border-box", padding: "12px 14px", color: "#F0F2F0", background: "rgba(42, 41, 45, 0.88)", border: "1px solid rgba(240, 242, 240, 0.28)", borderRadius: 8 },
  button: { width: "100%", marginTop: 24, padding: "12px 16px", color: "#222124", background: "#F0F2F0", border: 0, borderRadius: 999, cursor: "pointer", fontWeight: 600 },
  message: { margin: "16px 0 0", color: "#C9C6CF", fontSize: 14 },
  footer: { margin: "24px 0 0", color: "#9A989F", fontSize: 14, textAlign: "center" },
  link: { color: "#F0F2F0", textDecoration: "none" },
};

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isLogin = mode === "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const supabase = createClient();
    const result = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      setMessage(isLogin ? "Invalid email or password. អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។" : "Unable to create account. Please check your details and try again. មិនអាចបង្កើតគណនីបានទេ។ សូមពិនិត្យព័ត៌មានរបស់អ្នក ហើយព្យាយាមម្តងទៀត។");
      return;
    }

    if (isLogin) {
      router.push("/");
      return;
    }

    setMessage("Account created. Check your email if confirmation is required. គណនីត្រូវបានបង្កើតហើយ។ សូមពិនិត្យអ៊ីមែលរបស់អ្នក ប្រសិនបើត្រូវការការបញ្ជាក់។");
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>{collection.name.toUpperCase()}</p>
        <h1 style={styles.title}>{isLogin ? "Log in" : "Create an account"}</h1>
        <p style={styles.description}>{isLogin ? "Continue to your archive." : "Create an account to contribute to the archive."}</p>
        <form onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="email">EMAIL</label>
          <input style={styles.input} id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          <label style={styles.label} htmlFor="password">PASSWORD</label>
          <input style={styles.input} id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete={isLogin ? "current-password" : "new-password"} />
          <button style={styles.button} type="submit" disabled={isSubmitting}>{isSubmitting ? "Please wait..." : isLogin ? "Log in" : "Sign up"}</button>
        </form>
        {message && <p role="status" style={styles.message}>{message}</p>}
        <p style={styles.footer}>
          {isLogin ? "Need an account? " : "Already have an account? "}
          <Link style={styles.link} href={isLogin ? "/signup" : "/login"}>{isLogin ? "Sign up" : "Log in"}</Link>
        </p>
      </section>
    </main>
  );
}