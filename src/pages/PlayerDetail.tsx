import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { allPlayers, teams, playerMatchRatings } from "@/data/mockData";
import { RatingBadge } from "@/components/RatingBadge";
import { StarRating } from "@/components/StarRating";
import { ArrowLeft, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const positionColor: Record<string, string> = {
  GK: "text-accent",
  DF: "text-blue-400",
  MF: "text-pitch",
  FW: "text-destructive",
};

const PlayerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const player = allPlayers.find((p) => p.id === id);

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        선수를 찾을 수 없습니다.
      </div>
    );
  }

  const team = teams.find((t) => t.id === player.teamId);
  const matchRatings = playerMatchRatings[id || ""] || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/players")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          전체 선수
        </button>

        {/* Player header */}
        <div className="rounded-xl border border-border bg-card p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-secondary font-display text-2xl font-bold text-secondary-foreground">
              {player.number}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold text-foreground">
                {player.nameKr}
              </h1>
              <p className="text-sm text-muted-foreground">{player.name}</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className={cn("font-display font-semibold", positionColor[player.position])}>
                  {player.position}
                </span>
                {team && (
                  <span className="text-muted-foreground">{team.name}</span>
                )}
                <span className="text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {player.totalRatings.toLocaleString()}명 평가
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RatingBadge rating={player.avgRating} size="lg" />
              <span className="text-xs text-muted-foreground">시즌 평균</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <StarRating rating={player.avgRating} size="md" />
            <span className="font-display text-sm text-muted-foreground">
              {player.avgRating.toFixed(1)} / 5.0
            </span>
          </div>
        </div>

        {/* Match-by-match ratings */}
        <h2 className="font-display font-semibold text-foreground text-sm mb-4">
          경기별 평균 평점
        </h2>
        {matchRatings.length === 0 ? (
          <p className="text-muted-foreground text-sm">아직 경기별 평점 데이터가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {matchRatings.map((mr) => (
              <button
                key={mr.matchId}
                onClick={() => navigate(`/match/${mr.matchId}`)}
                className="flex items-center gap-4 w-full rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:bg-secondary/50 transition-all text-left"
              >
                <span className="text-xs text-muted-foreground font-display min-w-[4rem]">
                  {mr.date.slice(5)}
                </span>
                <span className="flex-1 text-sm text-foreground">
                  vs {mr.opponent}
                </span>
                <StarRating rating={mr.rating} size="sm" />
                <RatingBadge rating={mr.rating} size="sm" />
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PlayerDetail;
