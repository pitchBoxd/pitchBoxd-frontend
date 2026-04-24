import { useParams, useNavigate } from "react-router";
import { Header } from "@/components/Header";
import { teams, matches } from "@/data/mockData";
import { RatingBadge } from "@/components/RatingBadge";
import { ArrowLeft, Users } from "lucide-react";

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const team = teams.find((t) => t.id === id);

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        팀을 찾을 수 없습니다.
      </div>
    );
  }

  const teamMatches = matches
    .filter((m) => m.homeTeamId === id || m.awayTeamId === id)
    .sort((a, b) => a.round - b.round);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/teams")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          전체 팀
        </button>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-4xl">{team.logo}</span>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {team.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              📍 {team.stadium} · {team.city}
            </p>
          </div>
        </div>

        <h2 className="font-display font-semibold text-foreground text-sm mb-4">
          2026 시즌 경기 일정
        </h2>

        <div className="space-y-2">
          {teamMatches.length === 0 && (
            <p className="text-muted-foreground text-sm">등록된 경기가 없습니다.</p>
          )}
          {teamMatches.map((match) => {
            const isHome = match.homeTeamId === id;
            const opponent = isHome ? match.awayTeam : match.homeTeam;
            const result = isHome
              ? match.homeScore > match.awayScore ? "승" : match.homeScore < match.awayScore ? "패" : "무"
              : match.awayScore > match.homeScore ? "승" : match.awayScore < match.homeScore ? "패" : "무";
            const resultColor = result === "승" ? "text-pitch" : result === "패" ? "text-destructive" : "text-muted-foreground";

            return (
              <button
                key={match.id}
                onClick={() => navigate(`/match/${match.id}`)}
                className="flex items-center gap-4 w-full rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:bg-secondary/50 transition-all text-left"
              >
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-xs text-muted-foreground font-display">R{match.round}</span>
                  <span className="text-xs text-muted-foreground">{match.date.slice(5)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{isHome ? "vs" : "@"}</span>
                    <span className="font-display font-medium text-sm text-foreground">{opponent}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{match.venue}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-foreground">
                    {match.homeScore} : {match.awayScore}
                  </span>
                  <span className={`font-display font-bold text-xs ${resultColor}`}>
                    {result}
                  </span>
                  <RatingBadge rating={match.avgRating} size="sm" />
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default TeamDetail;
