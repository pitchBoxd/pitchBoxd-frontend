import { Tv } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between h-14 px-4 mx-auto max-w-5xl">
        <div className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-pitch" />
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            PitchBoxd
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="text-foreground font-medium">경기</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">선수</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">순위</span>
        </nav>
      </div>
    </header>
  );
};
