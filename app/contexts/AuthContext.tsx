import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { reissue, getMyInfo, logout as apiLogout } from "@/lib/api/auth";

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
  updateFavoriteTeam: (teamId: string | null) => void;
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
  updateFavoriteTeam: () => {},
});

export const TEAM_NUMBER_ID_MAP: Record<number, string> = {
  1: "fcseoul",
  2: "ulsan",
  3: "jeonbuk",
  6: "gwangju",
  7: "pohang",
  9: "gimcheon",
  10: "incheon",
  11: "gangwon",
  12: "jeju",
  13: "suwon",
  26: "daegu",
  27: "suwonfc",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const wasLoggedIn = typeof window !== "undefined" && localStorage.getItem("is_logged_in") === "true";
    if (!wasLoggedIn) {
      setIsLoading(false);
      return;
    }

    getMyInfo()
      .then((data) => {
        const serverTeamId = data.favoriteTeamId;
        const mappedTeamId = serverTeamId ? TEAM_NUMBER_ID_MAP[serverTeamId] : null;
        const storedTeamId = mappedTeamId || (typeof window !== "undefined" ? localStorage.getItem(`favoriteTeam_${data.id}`) : null);
        setUser({ id: data.id, nickname: data.nickname, myTeamId: storedTeamId || undefined });
      })
      .catch(() => {
        return reissue()
          .then((data) => {
            const serverTeamId = data.favoriteTeamId;
            const mappedTeamId = serverTeamId ? TEAM_NUMBER_ID_MAP[serverTeamId] : null;
            const storedTeamId = mappedTeamId || (typeof window !== "undefined" ? localStorage.getItem(`favoriteTeam_${data.id}`) : null);
            setUser({ id: data.id, nickname: data.nickname, myTeamId: storedTeamId || undefined });
          })
          .catch(() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("is_logged_in");
            }
          });
      })
      .finally(() => setIsLoading(false));
  }, []);


  const loginWithUser = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    if (typeof window !== "undefined" && nextUser.id) {
      localStorage.setItem("is_logged_in", "true");
      if (nextUser.myTeamId) {
        localStorage.setItem(`favoriteTeam_${nextUser.id}`, nextUser.myTeamId);
      } else {
        localStorage.removeItem(`favoriteTeam_${nextUser.id}`);
      }
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout()
      .catch((err) => console.error("Failed to logout on backend:", err))
      .finally(() => {
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("is_logged_in");
        }
      });
  }, []);

  const updateFavoriteTeam = useCallback((teamId: string | null) => {
    if (!user) return;
    const nextUser = { ...user, myTeamId: teamId || undefined };
    setUser(nextUser);
    if (typeof window !== "undefined") {
      if (teamId) {
        localStorage.setItem(`favoriteTeam_${user.id}`, teamId);
      } else {
        localStorage.removeItem(`favoriteTeam_${user.id}`);
      }
    }
  }, [user]);

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
        updateFavoriteTeam,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

