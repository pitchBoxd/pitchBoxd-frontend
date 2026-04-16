import { createContext, useContext, useState, ReactNode } from "react";

interface AuthState {
  isLoggedIn: boolean;
  nickname: string;
  myTeamId: string;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  nickname: "",
  myTeamId: "",
  login: () => {},
  logout: () => {},
});

// Demo user — auto-login with preset data
const DEMO_USER = {
  nickname: "K리그팬_준호",
  myTeamId: "fcseoul",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("demo_logged_in") === "true"
  );

  const login = () => {
    localStorage.setItem("demo_logged_in", "true");
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("demo_logged_in");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        nickname: isLoggedIn ? DEMO_USER.nickname : "",
        myTeamId: isLoggedIn ? DEMO_USER.myTeamId : "",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
