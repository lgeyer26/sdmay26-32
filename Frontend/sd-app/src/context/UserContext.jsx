import { createContext, useContext, useState } from "react";

/* ─────────────────────────────────────────────────────────────────
   UserContext
   Wraps the entire app so any component can call useUser()
   to read or update the logged-in user — no prop drilling,
   no per-file localStorage imports.

   Usage in any component:
     import { useUser } from "../../context/UserContext";
     const { user, setUser, clearUser } = useUser();

   user shape: { user_id: number, email: string, role: string } | null
───────────────────────────────────────────────────────────────── */

const SESSION_KEY = "sdmay26_user";

// Read initial user from localStorage so state survives page refresh
function loadUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUserState] = useState(loadUser);

  // Save to both state and localStorage
  const setUser = (userData) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setUserState(userData);
  };

  // Clear from both state and localStorage (call on sign out)
  const clearUser = () => {
    localStorage.removeItem(SESSION_KEY);
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook — call this in any component to access the user
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
