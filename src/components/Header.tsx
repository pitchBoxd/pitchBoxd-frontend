import { Tv, User, LogIn } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "경기", path: "/" },
  { label: "라운드", path: "/rounds" },
  { label: "팀", path: "/teams" },
  { label: "선수", path: "/players" },
];

export const Header = () => {
  const location = useLocation();
  // Simulated login state — replace with real auth later
  const isLoggedIn = !!localStorage.getItem("myTeamId");

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex items-center h-14 px-4 mx-auto max-w-5xl">
        {/* Left: Logo */}
        <NavLink to="/" className="flex items-center gap-2 mr-6">
          <Tv className="w-5 h-5 text-pitch" />
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            PitchBoxd
          </span>
        </NavLink>

        {/* Center: Nav */}
        <nav className="flex-1 flex items-center justify-center gap-6 text-sm">
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Login / Profile */}
        {isLoggedIn ? (
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => {}}>
            <User className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
            <LogIn className="w-4 h-4" />
            <span className="text-xs">로그인</span>
          </Button>
        )}
      </div>
    </header>
  );
};
