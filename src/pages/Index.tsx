import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { matches, matchReviews, teams } from "@/data/mockData";
import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import { ReviewCard } from "@/components/ReviewCard";
import { TrendingUp, Flame, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TODAY = "2026-03-23";

// Get ISO week start (Monday) and end (Sunday)
function getWeekRange(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const mon = new Date(d);
  mon.setDate(d.getDate() + diffToMon);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return {
    start: mon.toISOString().slice(0, 10),
    end: sun.toISOString().slice(0, 10),
  };
}

type FilterMode = "round" | "week";

const Index = () => {
  const navigate = useNavigate();

  // My team from localStorage
  const [myTeamId, setMyTeamId] = useState<string>(
    () => localStorage.getItem("myTeamId") || ""
  );

  // Filter mode
  const [filterMode, setFilterMode] = useState<FilterMode>("round");

  // Determine the latest completed round
  const latestRound = useMemo(() => {
    const completedMatches = matches.filter((m) => m.date <= TODAY && m.totalRatings > 0);
    if (completedMatches.length === 0) return 12;
    return Math.max(...completedMatches.map((m) => m.round));
  }, []);

  // Week range from TODAY
  const weekRange = useMemo(() => getWeekRange(TODAY), []);

  // Filtered matches based on mode
  const filteredMatches = useMemo(() => {
    if (filterMode === "round") {
      return matches.filter((m) => m.round === latestRound);
    }
    return matches.filter(
      (m) => m.date >= weekRange.start && m.date <= weekRange.end
    );
  }, [filterMode, latestRound, weekRange]);

  // My team's match from filtered
  const myTeamMatch = useMemo(() => {
    if (!myTeamId) return null;
    return filteredMatches.find(
      (m) => m.homeTeamId === myTeamId || m.awayTeamId === myTeamId
    ) || null;
  }, [myTeamId, filteredMatches]);

  // Other matches (exclude my team match)
  const otherMatches = useMemo(() => {
    if (!myTeamMatch) return filteredMatches;
    return filteredMatches.filter((m) => m.id !== myTeamMatch.id);
  }, [filteredMatches, myTeamMatch]);

  // Hot reviews filtered
  const hotReviews = useMemo(() => {
    const filteredIds = new Set(filteredMatches.map((m) => m.id));
    return Object.entries(matchReviews)
      .filter(([matchId]) => filteredIds.has(matchId))
      .flatMap(([, reviews]) => reviews)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5);
  }, [filteredMatches]);

  const handleMatchClick = (id: string) => navigate(`/match/${id}`);

  const handleTeamSelect = (teamId: string) => {
    setMyTeamId(teamId);
    localStorage.setItem("myTeamId", teamId);
    // Force header re-render by triggering state
    window.dispatchEvent(new Event("storage"));
  };

  const filterLabel =
    filterMode === "round"
      ? `라운드 ${latestRound}`
      : `${weekRange.start.slice(5)} ~ ${weekRange.end.slice(5)}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-pitch" />
            <span className="text-xs uppercase tracking-[0.2em] font-display text-pitch">
              K리그 1 · 2026
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-2">
            경기를 기록하고,
            <br />
            <span className="text-pitch">선수를 평가하세요.</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md">
            팬들의 시선으로 완성하는 K리그 매치 리뷰 플랫폼
          </p>
        </div>

        {/* My Team Match (only when logged in with a team) */}
        {myTeamId && myTeamMatch && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-pitch" />
              <span className="font-display text-xs font-semibold text-pitch">
                우리 팀 경기
              </span>
            </div>
            <MatchCard match={myTeamMatch} onClick={handleMatchClick} featured />
          </div>
        )}

        {/* Match List Header with Filter Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-foreground text-sm">
            {filterLabel} 전체 경기
          </h2>
          <div className="flex items-center rounded-lg border border-border bg-secondary p-0.5 text-xs">
            <button
              onClick={() => setFilterMode("round")}
              className={cn(
                "px-3 py-1.5 rounded-md transition-colors font-medium",
                filterMode === "round"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              라운드
            </button>
            <button
              onClick={() => setFilterMode("week")}
              className={cn(
                "px-3 py-1.5 rounded-md transition-colors font-medium",
                filterMode === "week"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              이번 주
            </button>
          </div>
        </div>

        {/* Match Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {otherMatches.length > 0 ? (
            otherMatches.map((match) => (
              <MatchCard key={match.id} match={match} onClick={handleMatchClick} />
            ))
          ) : (
            <p className="col-span-2 text-center text-sm text-muted-foreground py-8">
              해당 기간에 경기가 없습니다
            </p>
          )}
        </div>

        {/* Hot Reviews */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-pitch" />
            <h2 className="font-display font-semibold text-foreground text-sm">
              {filterLabel} 가장 핫한 한줄평
            </h2>
          </div>
          <div className="space-y-3">
            {hotReviews.length > 0 ? (
              hotReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">
                아직 한줄평이 없습니다
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
