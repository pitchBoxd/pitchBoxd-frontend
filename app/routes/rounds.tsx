import { useNavigate } from "react-router";
import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState, useEffect } from "react";
import { useMatches } from "@/lib/queries/matches";
import { getTeams, getSeasons } from "@/lib/api/matches";
import { useQuery } from "@tanstack/react-query";
import { toMatch } from "@/lib/adapters/match";
import { useAuth, TEAM_NUMBER_ID_MAP } from "@/contexts/AuthContext";
import type { Match } from "@/data/mockData";

const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Rounds = () => {
  const navigate = useNavigate();
  const { isLoggedIn, myTeamId } = useAuth();
  
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("1"); // default to "1" (2026 season)
  const [selectedRound, setSelectedRound] = useState<string>("all");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("all");

  // Fetch seasons list from API
  const { data: seasonsList, isLoading: isSeasonsLoading } = useQuery({
    queryKey: ["seasons", "all"],
    queryFn: () => getSeasons().then((r) => r.seasonResponses),
  });

  // Fetch teams list from API for dropdown
  const { data: teamsList, isLoading: isTeamsLoading } = useQuery({
    queryKey: ["teams", "all"],
    queryFn: () => getTeams().then((r) => r.teamResponses),
  });

  // Find user's favorite team's numeric backend ID
  const favoriteTeamNumberId = useMemo(() => {
    if (!isLoggedIn || !myTeamId || !teamsList) return "all";
    const pair = Object.entries(TEAM_NUMBER_ID_MAP).find(
      ([, val]) => val === myTeamId
    );
    return pair ? pair[0] : "all";
  }, [isLoggedIn, myTeamId, teamsList]);

  // Set default team filter to user's favorite team upon loading
  useEffect(() => {
    if (favoriteTeamNumberId !== "all") {
      setSelectedTeamId(favoriteTeamNumberId);
    }
  }, [favoriteTeamNumberId]);

  // Fetch matches from API (using selectedSeasonId and selectedTeamId from dropdowns)
  const { data: apiMatches, isLoading: isMatchesLoading } = useMatches({
    seasonId: Number(selectedSeasonId),
    teamId: selectedTeamId === "all" ? undefined : Number(selectedTeamId),
  });

  // Map API matches to Match objects
  const mappedMatches = useMemo(() => {
    if (!apiMatches) return [];
    return apiMatches.map((m) => toMatch(m));
  }, [apiMatches]);

  // Extract unique rounds from current match list
  const availableRounds = useMemo(() => {
    const rounds = Array.from(new Set(mappedMatches.map((m) => m.round)));
    return rounds.sort((a, b) => a - b);
  }, [mappedMatches]);

  // Filter matches based on selected round (client-side since API doesn't support round filter)
  const filteredMatches = useMemo(() => {
    return mappedMatches.filter((m) => {
      return selectedRound === "all" || m.round === Number(selectedRound);
    });
  }, [mappedMatches, selectedRound]);

  // Sort filtered matches by date descending (most recent first)
  const sortedMatches = useMemo(() => {
    return [...filteredMatches].sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredMatches]);

  const isMatchCompleted = (date: string) => date <= getLocalDateString();

  const handleMatchClick = (id: string) => {
    navigate(`/match/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-border/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-pitch" />
              <span className="text-xs uppercase tracking-[0.2em] font-display text-pitch">
                {seasonsList?.find((s) => String(s.id) === selectedSeasonId)?.name || "2026"}시즌
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              경기 목록
            </h1>
          </div>

          {/* Dropdown Filters Section */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Season Filter */}
            <div className="flex flex-col gap-1.5 min-w-[200px] flex-1 md:flex-initial">
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-display">
                리그 / 시즌
              </label>
              <select
                value={selectedSeasonId}
                onChange={(e) => setSelectedSeasonId(e.target.value)}
                disabled={isSeasonsLoading}
                className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-pitch transition-all cursor-pointer disabled:opacity-50"
              >
                {isSeasonsLoading ? (
                  <option value="1">로딩 중...</option>
                ) : (
                  seasonsList?.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.name}시즌
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Round Filter */}
            <div className="flex flex-col gap-1.5 min-w-[110px] flex-1 md:flex-initial">
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-display">
                라운드
              </label>
              <select
                value={selectedRound}
                onChange={(e) => setSelectedRound(e.target.value)}
                className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-pitch transition-all cursor-pointer"
              >
                <option value="all">전체 라운드</option>
                {availableRounds.map((r) => (
                  <option key={r} value={r}>
                    {r} 라운드
                  </option>
                ))}
              </select>
            </div>

            {/* Team Filter */}
            <div className="flex flex-col gap-1.5 min-w-[170px] flex-1 md:flex-initial">
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-display">
                참가 팀
              </label>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                disabled={isTeamsLoading}
                className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-pitch transition-all cursor-pointer disabled:opacity-50"
              >
                <option value="all">전체 팀</option>
                {teamsList?.map((team) => (
                  <option key={team.id} value={String(team.id)}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isMatchesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-10">
            <div className="h-28 bg-card rounded-lg border border-border animate-pulse"></div>
            <div className="h-28 bg-card rounded-lg border border-border animate-pulse"></div>
            <div className="h-28 bg-card rounded-lg border border-border animate-pulse"></div>
            <div className="h-28 bg-card rounded-lg border border-border animate-pulse"></div>
          </div>
        ) : sortedMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedMatches.map((match) =>
              isMatchCompleted(match.date) ? (
                <MatchCard
                  key={match.id}
                  match={match}
                  onClick={handleMatchClick}
                />
              ) : (
                <div
                  key={match.id}
                  className="rounded-lg border border-border bg-card/40 p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground"
                >
                  <Clock className="w-4 h-4" />
                  <p className="text-xs font-display font-semibold">
                    {match.homeTeam} vs {match.awayTeam}
                  </p>
                  <p className="text-[10px] font-display">
                    R{match.round} · {match.date} · 경기 예정
                  </p>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/60 rounded-xl bg-secondary/10">
            <Calendar className="w-8 h-8 text-muted-foreground/60 mb-3" />
            <p className="text-sm font-semibold text-foreground">조건에 맞는 경기가 없습니다.</p>
            <p className="text-xs text-muted-foreground mt-1">다른 시즌, 라운드 또는 팀을 선택해 보세요.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Rounds;
