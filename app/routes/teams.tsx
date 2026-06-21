import { useNavigate } from "react-router";
import { Header } from "@/components/Header";
import { getTeamDetails } from "@/lib/api/matches";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Users, Trophy, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { findTeam } from "@/lib/adapters/match";

// 백엔드 팀 ID → 한국어 공식 팀명 매핑
const TEAM_KOREAN_NAME: Record<string, string> = {
  seoul: "FC 서울",
  ulsan: "울산 HD",
  jeonbuk: "전북 현대",
  daejeon: "대전 하나 시티즌",
  bucheon: "부천 FC 1995",
  gwangju: "광주 FC",
  pohang: "포항 스틸러스",
  anyang: "FC 안양",
  kimcheon: "김천 상무",
  incheon: "인천 유나이티드",
  gangwon: "강원 FC",
  jeju: "제주 유나이티드",
  suwon: "수원 삼성",
  seoul_eland: "서울 이랜드",
  seongnam: "성남 FC",
  jeonnam: "전남 드래곤즈",
  kimpo: "김포 FC",
  busan: "부산 아이파크",
  chungnam_asan: "충남 아산",
  hwasung: "화성 FC",
  gyeongnam: "경남 FC",
  chungbuk_cheongju: "청주 FC",
  cheonan: "천안 시티",
  ansan: "안산 그리너스",
  kimhae: "김해 시티",
  daegu: "대구 FC",
  suwonfc: "수원 FC",
  yongin: "용인 FC",
  paju: "파주 시티",
};

function formatFollowerCount(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}만`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}천`;
  return count.toLocaleString();
}

const Teams = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["teams", "details"],
    queryFn: () => getTeamDetails().then((r) => r.teamDetailResponses),
    staleTime: 5 * 60 * 1000,
  });

  const teams = data ?? [];

  // 팔로워 수 기준으로 정렬 (내림차순)
  const sortedTeams = [...teams].sort((a, b) => b.followerCount - a.followerCount);
  const topFollowers = sortedTeams[0]?.followerCount ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-10">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-pitch" />
            <span className="text-xs uppercase tracking-[0.2em] font-display text-pitch">
              K리그
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                구단 현황
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                팬 수를 기준으로 정렬되어 있습니다
              </p>
            </div>
            {!isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full border border-border/40">
                <Users className="w-3.5 h-3.5" />
                <span>총 <strong className="text-foreground">{teams.length}</strong>개 구단</span>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-28 bg-card rounded-xl border border-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedTeams.map((team, index) => {
              const mockTeam = findTeam(team.name);
              const koreanName = TEAM_KOREAN_NAME[team.name] ?? team.name;
              const isTopFan = topFollowers > 0 && team.followerCount === topFollowers;
              const followerRatio = topFollowers > 0 ? team.followerCount / topFollowers : 0;

              return (
                <button
                  key={team.id}
                  onClick={() => navigate(`/teams/${mockTeam?.id ?? team.name}`)}
                  className={cn(
                    "group relative flex flex-col gap-3 rounded-xl border bg-card p-4 text-left transition-all duration-200 overflow-hidden",
                    "hover:border-primary/40 hover:bg-surface-hover hover:shadow-lg hover:shadow-primary/5",
                    isTopFan
                      ? "border-pitch/40 bg-gradient-to-br from-card to-pitch-dim/15"
                      : "border-border"
                  )}
                >
                  {/* Top-right rank badge for top 3 */}
                  {index < 3 && team.followerCount > 0 && (
                    <span className={cn(
                      "absolute top-3 right-3 text-[9px] font-display font-bold px-1.5 py-0.5 rounded tracking-wider",
                      index === 0 ? "text-yellow-500 bg-yellow-500/10 border border-yellow-500/20" :
                      index === 1 ? "text-slate-300 bg-slate-400/10 border border-slate-400/20" :
                                   "text-amber-600 bg-amber-700/10 border border-amber-700/20"
                    )}>
                      {index === 0 ? "🥇 1위" : index === 1 ? "🥈 2위" : "🥉 3위"}
                    </span>
                  )}

                  {/* Team identity row */}
                  <div className="flex items-center gap-3 pr-16">
                    <div className={cn(
                      "w-11 h-11 rounded-lg flex items-center justify-center text-2xl shrink-0 transition-transform duration-200 group-hover:scale-110",
                      "bg-secondary/50 border border-border/60"
                    )}>
                      {mockTeam?.logo ?? "⚽"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold text-foreground text-sm leading-tight truncate group-hover:text-pitch transition-colors">
                        {koreanName}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        {team.stadium}
                      </p>
                    </div>
                  </div>

                  {/* Follower bar + count */}
                  <div className="space-y-1.5">
                    {/* Progress bar */}
                    <div className="h-1 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isTopFan ? "bg-pitch" : followerRatio > 0.5 ? "bg-primary/70" : "bg-primary/30"
                        )}
                        style={{ width: `${Math.max(followerRatio * 100, team.followerCount > 0 ? 4 : 0)}%` }}
                      />
                    </div>

                    {/* Follower count + chevron */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        {team.followerCount > 0 ? (
                          <div className="flex items-baseline gap-1">
                            <span className={cn(
                              "font-display font-black text-sm leading-none tabular-nums",
                              isTopFan ? "text-pitch" : "text-foreground"
                            )}>
                              {formatFollowerCount(team.followerCount)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">팬</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/60 font-display">팬 없음</span>
                        )}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-pitch group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Teams;
