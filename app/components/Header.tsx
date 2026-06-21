import { Tv, User, LogIn, LogOut } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "홈", path: "/" },
  { label: "경기", path: "/rounds" },
  { label: "팀", path: "/teams" },
];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, nickname, logout } = useAuth();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex items-center h-14 px-4 mx-auto max-w-5xl">
        <NavLink to="/" className="flex items-center gap-2 mr-6">
          <Tv className="w-5 h-5 text-pitch" />
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            PitchBoxd
          </span>
        </NavLink>

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

        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full gap-2">
                <div className="w-6 h-6 rounded-full bg-pitch flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="text-xs text-foreground hidden sm:inline">{nickname}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => navigate("/profile")} className="gap-2 cursor-pointer">
                <User className="w-4 h-4" />
                마이페이지
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="gap-2 text-destructive cursor-pointer">
                <LogOut className="w-4 h-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-1.5"
            onClick={() => navigate("/login")}
          >
            <LogIn className="w-4 h-4" />
            <span className="text-xs">로그인</span>
          </Button>
        )}
      </div>
    </header>
  );
};
