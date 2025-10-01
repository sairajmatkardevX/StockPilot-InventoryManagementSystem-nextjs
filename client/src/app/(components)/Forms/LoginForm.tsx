"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error.includes("No user")) {
        router.push("/register");
      } else {
        setError("Invalid email or password");
      }
    } else {
      router.replace("/dashboard");
    }
  };

  if (status === "loading") return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingText}>Checking authentication...</div>
    </div>
  );
  
  if (status === "authenticated") return null;

  return (
    <div style={styles.container}>
      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <svg style={styles.logoSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 style={styles.title}>Sign In</h1>
          <p style={styles.subtitle}>Sign in to your inventory dashboard</p>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <div style={styles.errorContent}>
              <svg style={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span style={styles.errorText}>{error}</span>
            </div>
          </div>
        )}

        <div style={styles.inputsContainer}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? (
            <>
              <div style={styles.spinner}></div>
              <span>Signing In...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{" "}
            <a
              href="/register"
              style={styles.link}
            >
              Create one now
            </a>
          </p>
        </div>
      </form>

      <style jsx>{`
        /* Force styles with high specificity and !important */
        .login-container * {
          box-sizing: border-box !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Override any global styles */
        .login-container input,
        .login-container button,
        .login-container form {
          all: unset !important;
        }
      `}</style>
    </div>
  );
}

// Inline styles to override any CSS framework or global styles
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    padding: '1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  } as React.CSSProperties,
  
  form: {
    background: 'white',
    borderRadius: '1rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '2rem',
    width: '100%',
    maxWidth: '28rem',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,
  
  header: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  } as React.CSSProperties,
  
  logo: {
    width: '4rem',
    height: '4rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem auto',
    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
  } as React.CSSProperties,
  
  logoSvg: {
    width: '2rem',
    height: '2rem',
    color: 'white',
  } as React.CSSProperties,
  
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  
  subtitle: {
    color: '#6b7280',
  } as React.CSSProperties,
  
  errorContainer: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  
  errorContent: {
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  
  errorIcon: {
    width: '1.25rem',
    height: '1.25rem',
    color: '#ef4444',
    marginRight: '0.5rem',
  } as React.CSSProperties,
  
  errorText: {
    color: '#b91c1c',
    fontSize: '0.875rem',
    fontWeight: '500',
  } as React.CSSProperties,
  
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  } as React.CSSProperties,
  
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  } as React.CSSProperties,
  
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
  } as React.CSSProperties,
  
  button: {
    width: '100%',
    backgroundColor: '#2563eb',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s ease-in-out',
    marginTop: '1.5rem',
  } as React.CSSProperties,
  
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  } as React.CSSProperties,
  
  spinner: {
    width: '1.25rem',
    height: '1.25rem',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  } as React.CSSProperties,
  
  footer: {
    textAlign: 'center' as const,
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb',
  } as React.CSSProperties,
  
  footerText: {
    color: '#6b7280',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  
  link: {
    color: '#2563eb',
    fontWeight: '600',
    textDecoration: 'underline',
    cursor: 'pointer',
  } as React.CSSProperties,
  
  loadingContainer: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  } as React.CSSProperties,
  
  loadingText: {
    fontSize: '1.125rem',
    color: '#6b7280',
  } as React.CSSProperties,
};