"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Elements */}
      <div style={styles.backgroundElements}>
        <div style={styles.backgroundCircle1}></div>
        <div style={styles.backgroundCircle2}></div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <svg style={styles.logoSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join your inventory management system</p>
        </div>

        {/* Error Message */}
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

        {/* Form Fields */}
        <div style={styles.inputsContainer}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
        </div>

        {/* Submit Button */}
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
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{" "}
            <a
              href="/login"
              style={styles.link}
            >
              Sign in here
            </a>
          </p>
        </div>
      </form>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Force styles with high specificity */
        .register-container * {
          box-sizing: border-box !important;
        }
        
        /* Override any global styles */
        .register-container input,
        .register-container button,
        .register-container form {
          all: unset !important;
        }
        
        .register-container input:focus,
        .register-container button:focus {
          outline: none !important;
          box-shadow: none !important;
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
    position: 'relative' as const,
  } as React.CSSProperties,
  
  backgroundElements: {
    position: 'fixed' as const,
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none' as const,
  } as React.CSSProperties,
  
  backgroundCircle1: {
    position: 'absolute' as const,
    top: '-10rem',
    right: '-8rem',
    width: '20rem',
    height: '20rem',
    backgroundColor: '#bfdbfe',
    borderRadius: '50%',
    mixBlendMode: 'multiply' as const,
    opacity: 0.2,
    filter: 'blur(3rem)',
  } as React.CSSProperties,
  
  backgroundCircle2: {
    position: 'absolute' as const,
    bottom: '-10rem',
    left: '-8rem',
    width: '20rem',
    height: '20rem',
    backgroundColor: '#c7d2fe',
    borderRadius: '50%',
    mixBlendMode: 'multiply' as const,
    opacity: 0.2,
    filter: 'blur(3rem)',
  } as React.CSSProperties,
  
  form: {
    position: 'relative' as const,
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
    background: 'linear-gradient(135deg, #10b981 0%, #2563eb 100%)',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem auto',
    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
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
    gap: '1.25rem',
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
};