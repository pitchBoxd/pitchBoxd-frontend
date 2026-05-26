import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { reissue } from "@/lib/api/auth";

export interface AuthUser {
  id: number;
  nickname: string;
  myTeamId?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  userId: number | null;
  nickname: string;
  myTeamId: string;
  loginWithUser: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isLoading: true,
  user: null,
  userId: null,
  nickname: "",
  myTeamId: "",
  loginWithUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reissue()
      .then((data) => setUser({ id: data.id, nickname: data.nickname }))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const loginWithUser = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: user !== null,
        isLoading,
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
