import { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";

const getErrorMessage = (error) =>
  error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || error?.message || "Could not finish account setup.";

const AccountSetup = () => {
  const { user } = useUser();
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const saveAccount = async (event) => {
    event.preventDefault();
    const nextUsername = username.trim();

    if (!nextUsername) {
      setError("Please choose a username.");
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(nextUsername)) {
      setError("Username must be 3–30 characters using letters, numbers, or _. ");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError("");
      setIsSaving(true);
      if (user.username !== nextUsername) {
        await user.update({ username: nextUsername });
      }
      if (!user.passwordEnabled) {
        await user.updatePassword({ newPassword: password });
      }
      window.location.reload();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
      setIsSaving(false);
    }
  };

  return (
    <div className="account-setup-backdrop">
      <section className="account-setup-card" aria-labelledby="account-setup-title">
        <p className="eyebrow">One last step</p>
        <h1 id="account-setup-title">Complete your Chatakh account</h1>
        <p>Google verified your email. Choose a username and set a Chatakh password before continuing.</p>
        <form onSubmit={saveAccount} className="account-setup-form">
          <label>
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="your_name"
              autoComplete="username"
              disabled={isSaving}
            />
          </label>
          <label>
            New password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={isSaving}
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Type it again"
              autoComplete="new-password"
              disabled={isSaving}
            />
          </label>
          {error && <p className="account-setup-error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? "Saving your account..." : "Finish account setup"}
          </button>
        </form>
      </section>
    </div>
  );
};

const AccountSetupGate = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded || !isSignedIn || !user || (user.username && user.passwordEnabled)) {
    return children;
  }

  return (
    <>
      {children}
      <AccountSetup />
    </>
  );
};

export default AccountSetupGate;
