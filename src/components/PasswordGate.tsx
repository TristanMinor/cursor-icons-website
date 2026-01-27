import { useState, useCallback } from "react";

const VALID_PASSWORD = "anysphere";

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("cursor-icons-auth") === "1"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (password.toLowerCase().trim() === VALID_PASSWORD) {
        sessionStorage.setItem("cursor-icons-auth", "1");
        setAuthenticated(true);
      } else {
        setError(true);
        setTimeout(() => setError(false), 1500);
      }
    },
    [password]
  );

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="password-gate">
      <form className="password-gate-form" onSubmit={handleSubmit}>
        <div className="password-gate-title">Cursor Icons</div>
        <div className="password-gate-subtitle">
          Enter password to continue
        </div>
        <input
          className="password-gate-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-error={error}
          autoFocus
        />
        <button className="password-gate-btn" type="submit">
          Enter
        </button>
      </form>
    </div>
  );
}
