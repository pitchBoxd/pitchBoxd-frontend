import { useNavigate } from "react-router";
import { Header } from "@/components/Header";
import { allPlayers, teams } from "@/data/mockData";
import { RatingBadge } from "@/components/RatingBadge";
import { StarRating } from "@/components/StarRating";
import { Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const positionColor: Record<string, string> = {
  GK: "text-accent",
  DF: "text-blue-400",
  MF: "text-pitch",
  FW: "text-destructive",
};

const Players = () => {
  const navigate = useNavigate();
  const sorted = [...allPlayers].sort((a, b) => b.avgRating - a.avgRating);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">
          K리그 1 선수
        </h1>
        <div className="space-y-2">
          {sorted.map((player, i) => {
            const team = teams.find((t) => t.id === player.teamId);
            return (
              <button
                key={player.id}
                onClick={() => navigate(`/players/${player.id}`)}
                className="flex items-center gap-3 w-full rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:bg-secondary/50 transition-all text-left group"
              >
                <span className="font-display text-xs text-muted-foreground w-6 text-center">
                  {i + 1}
                </span>
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-secondary font-display text-xs font-bold text-secondary-foreground">
                  {player.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {player.nameKr}
                    <span className="text-muted-foreground font-normal ml-2 text-xs">
                      {player.name}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 text-xs mt-0.5">
                    <span className={cn("font-display font-semibold", positionColor[player.position])}>
                      {player.position}
                    </span>
                    {team && (
                      <span className="text-muted-foreground">{team.shortName}</span>
                    )}
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {player.totalRatings.toLocaleString()}
                    </span>
                  </div>
                </div>
                <StarRating rating={player.avgRating} size="sm" />
                <RatingBadge rating={player.avgRating} size="sm" />
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Players;
