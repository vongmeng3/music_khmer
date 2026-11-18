export const styles = {
  page: {
    minHeight: "100vh",
    padding: "120px clamp(16px, 4vw, 40px) 80px",
  },

  container: {
    maxWidth: 800,
    margin: "0 auto",
  },

  kicker: {
    fontFamily: "'Inter Tight', sans-serif",
    color: "#9A989F",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 16,
  },

  title: {
    fontSize: "clamp(34px, 6vw, 56px)",
    fontWeight: 400,
    letterSpacing: "-0.03em",
    margin: "0 0 12px",
    lineHeight: 1.1,
    color: "#F0F2F0",
  },

  description: {
    fontSize: 18,
    color: "#9A989F",
    lineHeight: 1.6,
    margin: "0 0 32px",
    letterSpacing: 0.1,
  },

  card: {
    padding: 32,
    backgroundColor: "rgba(34, 33, 36, 0.88)",
    border: "1px solid rgba(240, 242, 240, 0.14)",
    borderRadius: 10,
    backdropFilter: "blur(6px)",
  },

  loginPrompt: {
    textAlign: "center",
    padding: 48,
  },

  loginMessage: {
    color: "#F0F2F0",
    fontSize: 18,
    lineHeight: 1.6,
    marginBottom: 24,
  },

  loginButton: {
    display: "inline-block",
    padding: "12px 24px",
    color: "#222124",
    background: "#F0F2F0",
    border: 0,
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
  },

  field: {
    marginBottom: 24,
  },

  label: {
    display: "block",
    color: "#F0F2F0",
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 8,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    background: "#222124",
    color: "#F0F2F0",
    border: "1px solid rgba(240, 242, 240, 0.25)",
    borderRadius: 8,
    fontSize: 16,
    outline: "none",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 150,
    padding: "13px 14px",
    background: "#222124",
    color: "#F0F2F0",
    border: "1px solid rgba(240, 242, 240, 0.25)",
    borderRadius: 8,
    fontSize: 16,
    lineHeight: 1.6,
    resize: "vertical",
    outline: "none",
  },

  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    background: "#222124",
    color: "#F0F2F0",
    border: "1px solid rgba(240, 242, 240, 0.25)",
    borderRadius: 8,
    fontSize: 16,
    outline: "none",
  },

  help: {
    display: "block",
    color: "#9A989F",
    fontSize: 13,
    marginTop: 7,
  },

  warning: {
    color: "#FFD27A",
    fontSize: 14,
    lineHeight: 1.6,
    marginTop: 7,
  },

  error: {
    color: "#FF8A8A",
    fontSize: 14,
    marginTop: 7,
  },

  message: {
    padding: "12px 14px",
    marginBottom: 24,
    background: "rgba(255, 138, 138, 0.08)",
    border: "1px solid rgba(255, 138, 138, 0.25)",
    borderRadius: 8,
    color: "#FFB3B3",
    lineHeight: 1.5,
  },

  sectionTitle: {
    color: "#F0F2F0",
    fontSize: 17,
    fontWeight: 700,
    margin: "8px 0 20px",
    paddingBottom: 10,
    borderBottom: "1px solid rgba(240, 242, 240, 0.2)",
  },

  submitButton: {
    width: "100%",
    padding: "14px 20px",
    color: "#222124",
    background: "#F0F2F0",
    border: 0,
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
  },

  submitButtonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
