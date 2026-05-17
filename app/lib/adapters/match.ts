import { teams, type Match } from "@/data/mockData";
import type { MatchResponse } from "@/lib/api/types";

function findTeam(name: string) {
  return teams.find((t) => t.name === name || t.shortName === name);
}

function parseRound(round: string): number {
  const n = parseInt(round.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export function toMatch(response: MatchResponse): Match {
  const home = findTeam(response.homeTeam);
  const away = findTeam(response.awayTeam);
  const date = response.startDate ? response.startDate.slice(0, 10) : "";

  return {
    id: String(response.id),
    round: parseRound(response.round),
    homeTeam: response.homeTeam,
    awayTeam: response.awayTeam,
    homeTeamId: home?.id ?? "",
    awayTeamId: away?.id ?? "",
    homeScore: response.homeTeamScore,
    awayScore: response.awayTeamScore,
    date,
    venue: response.stadium,
    avgRating: response.matchRating,
    homeAvgRating: 0,
    awayAvgRating: 0,
    totalRatings: response.reviewCount,
    homeTeamLogo: home?.logo ?? "⚽",
    awayTeamLogo: away?.logo ?? "⚽",
  };
}
