import { Tv } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "경기", path: "/" },
  { label: "팀", path: "/teams" },
  { label: "선수", path: "/players" },
];

export const Header = () => {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between h-14 px-4 mx-auto max-w-5xl">
        <NavLink to="/" className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-pitch" />
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            PitchBoxd
          </span>
        </NavLink>
        <nav className="flex items-center gap-6 text-sm">
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
      </div>
    </header>
  );
};
