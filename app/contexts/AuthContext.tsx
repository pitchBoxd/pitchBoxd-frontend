import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface AuthUser {
  id: number;
  nickname: string;
  accessToken: string;
  myTeamId?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  userId: number | null;
  nickname: string;
  myTeamId: string;
  loginWithUser: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  user: null,
  userId: null,
  nickname: "",
  myTeamId: "",
  loginWithUser: () => {},
  logout: () => {},
});

const STORAGE_KEY = "pitchboxd_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const loginWithUser = useCallback((nextUser: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: user !== null,
        user,
        userId: user?.id ?? null,
        nickname: user?.nickname ?? "",
        myTeamId: user?.myTeamId ?? "",
        loginWithUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
