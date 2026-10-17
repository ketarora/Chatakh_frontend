import { Link } from "react-router-dom";
import { SignIn, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const useSafeClerkAuth = () => {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAuth();
  } catch {
    return { isLoaded: true };
  }
};

export default function Login() {
  const { isLoaded } = useSafeClerkAuth();
  const [isTakingLong, setIsTakingLong] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsTakingLong(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!hasClerk) {
    return (
      <div className="cart-page">
        <div className="empty-box">
          <p className="empty-face">🔑</p>
          <h3>Sign-in is napping</h3>
          <p>Login is unavailable in this preview. Add your Clerk key and refresh.</p>
          <Link to="/" className="btn-primary">Back home →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/logofinn.png" alt="Chatakh" className="auth-logo" />
        <h1>Welcome back, gorgeous</h1>
        <p>Sign in to track orders, save loves & checkout faster.</p>
        <p className="auth-status" role="status">
          {!isLoaded
            ? "Checking your secure sign-in..."
            : isTakingLong
              ? "Google verification is taking longer than usual. Please keep this tab open."
              : "Google verification may take a moment. Your account details will load after sign-in."}
        </p>
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          fallbackRedirectUrl="/"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent border-0 shadow-none",
              formButtonPrimary: "bg-[#ec0080] hover:bg-[#2B1A1E] text-white font-bold rounded-full py-3 transition-all duration-300",
              formFieldInput: "border-2 border-[#F3D9C8] rounded-xl px-4 py-3 focus:border-[#ec0080] bg-white text-[#2B1A1E]",
              footer: "hidden",
            },
          }}
        />
        <p className="auth-switch">
          New here? <Link to="/register">Create an account →</Link>
        </p>
      </div>
    </div>
  );
}
