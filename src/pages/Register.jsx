import { Link } from "react-router-dom";
import { SignUp } from "@clerk/clerk-react";

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

export default function Register() {
  if (!hasClerk) {
    return (
      <div className="cart-page">
        <div className="empty-box">
          <p className="empty-face">🔑</p>
          <h3>Sign-up is napping</h3>
          <p>Accounts are unavailable in this preview. Add your Clerk key and refresh.</p>
          <Link to="/" className="btn-primary">Back home →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/logofinn.png" alt="Chatakh" className="auth-logo" />
        <h1>Join the Chatakh club</h1>
        <p>Drops first, secret sales, faster checkout. Free forever.</p>
        <SignUp
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
          Already in? <Link to="/login">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
