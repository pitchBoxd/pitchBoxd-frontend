import { useParams, useNavigate } from "react-router";
import { Header } from "@/components/Header";
import { RatingBadge } from "@/components/RatingBadge";
import { PlayerRatingCard } from "@/components/PlayerRatingCard";
import { ReviewCard } from "@/components/ReviewCard";
import { StarRating } from "@/components/StarRating";
import { ArrowLeft, Users, Calendar, MapPin, Sparkles, MessageSquare, BarChart3, Crown, Award, Heart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { findTeam } from "@/lib/adapters/match";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api/client";
import { toast } from "sonner";
import { ReviewCountdown } from "@/components/ReviewCountdown";
import {
  useMatchResultData,
  useMatchStatsData,
  useMatchPersonalData,
  useMatchHotReviews,
  useCreateMatchReview,
  useUpdateMatchReview,
  useDeleteMatchReview,
  useToggleMatchReviewLike,
} from "@/lib/queries/matches";

const logoColorMap: Record<string, string> = {
  "🔴": "bg-red-500",
  "🔵": "bg-blue-500",
  "🟢": "bg-emerald-500",
  "🟠": "bg-orange-500",
  "🟡": "bg-yellow-500",
  "🟤": "bg-amber-700",
  "⚪": "bg-slate-400",
};

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, userId, myTeamId } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"reviews" | "lineup">("reviews");

  // Handle mock string IDs and numeric server IDs
  const matchId = useMemo(() => {
    return Number(id?.replace("match-", "")) || 0;
  }, [id]);

  const matchResultQuery = useMatchResultData(matchId);
  const matchStatsQuery = useMatchStatsData(matchId);
  const matchPersonalQuery = useMatchPersonalData(matchId, userId);
  const matchHotReviewsQuery = useMatchHotReviews(matchId, userId);

  const createMatchReviewMutation = useCreateMatchReview();
  const updateMatchReviewMutation = useUpdateMatchReview();
  const deleteMatchReviewMutation = useDeleteMatchReview();
  const toggleMatchReviewLikeMutation = useToggleMatchReviewLike();

  const [userRating, setUserRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const myReview = matchPersonalQuery.data?.myMatchReview;

  // Initialize rating and comment if user has already reviewed
  useEffect(() => {
    if (myReview) {
      setUserRating(myReview.rating / 2);
      setReviewContent(myReview.comment ?? "");
      setIsEditing(false);
    } else {
      setUserRating(0);
      setReviewContent("");
      setIsEditing(false);
    }
  }, [myReview]);

  const handleReviewSubmit = () => {
    if (!isLoggedIn || !userId) return;
    
    const handleError = (error: unknown, defaultMsg: string) => {
      let msg = defaultMsg;
      if (error instanceof ApiError) {
        if (error.body && typeof error.body === "object") {
          if ("message" in error.body && typeof error.body.message === "string") {
            msg = error.body.message;
          } else if ("error" in error.body && typeof error.body.error === "string") {
            msg = error.body.error;
          }
        } else if (typeof error.body === "string" && error.body.trim()) {
          msg = error.body;
        }
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast.error(msg);
    };

    if (myReview) {
      updateMatchReviewMutation.mutate(
        {
          matchReviewId: myReview.reviewId,
          matchId,
          userId,
          body: {
            point: userRating * 2,
            content: reviewContent || undefined,
          },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            toast.success("리뷰가 수정되었습니다.");
          },
          onError: (err) => handleError(err, "리뷰 수정에 실패했습니다."),
        }
      );
    } else {
      createMatchReviewMutation.mutate(
        {
          matchId,
          userId,
          body: {
            point: userRating * 2,
            content: reviewContent || undefined,
          },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            toast.success("리뷰가 등록되었습니다.");
          },
          onError: (err) => handleError(err, "리뷰 등록에 실패했습니다."),
        }
      );
    }
  };

  const handleReviewDelete = () => {
    if (!isLoggedIn || !userId || !myReview) return;
    
    if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      deleteMatchReviewMutation.mutate(
        {
          matchReviewId: myReview.reviewId,
          matchId,
          userId,
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            setUserRating(0);
            setReviewContent("");
          },
        }
      );
    }
  };

  const handleLikeToggle = (reviewId: number) => {
    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }
    toggleMatchReviewLikeMutation.mutate({
      matchReviewId: reviewId,
      userId,
    });
  };

  const isLoading = matchResultQuery.isLoading;
  const matchData = matchResultQuery.data;
  const statsData = matchStatsQuery.data;

  const isReviewExpired = useMemo(() => {
    if (!matchData?.reviewEndTime) return false;
    return Date.now() > new Date(matchData.reviewEndTime).getTime();
  }, [matchData?.reviewEndTime]);

  const formattedDate = useMemo(() => {
    if (!matchData?.startTime) return "";
    return new Date(matchData.startTime).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  }, [matchData?.startTime]);

  const homeTeam = useMemo(() => matchData ? findTeam(matchData.homeTeamName) : null, [matchData]);
  const awayTeam = useMemo(() => matchData ? findTeam(matchData.awayTeamName) : null, [matchData]);

  const homeTeamColor = useMemo(() => {
    const logo = homeTeam?.logo ?? "";
    switch (logo) {
      case "🔴": return { bg: "bg-red-500/5 hover:bg-red-500/10 transition-colors", border: "border-red-500/10", text: "text-red-500" };
      case "🔵": return { bg: "bg-blue-500/5 hover:bg-blue-500/10 transition-colors", border: "border-blue-500/10", text: "text-blue-500" };
      case "🟢": return { bg: "bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors", border: "border-emerald-500/10", text: "text-emerald-500" };
      case "🟠": return { bg: "bg-orange-500/5 hover:bg-orange-500/10 transition-colors", border: "border-orange-500/10", text: "text-orange-500" };
      case "🟡": return { bg: "bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors", border: "border-yellow-500/10", text: "text-yellow-500" };
      case "🟤": return { bg: "bg-amber-700/5 hover:bg-amber-700/10 transition-colors", border: "border-amber-700/10", text: "text-amber-600" };
      case "⚪": return { bg: "bg-slate-400/5 hover:bg-slate-400/10 transition-colors", border: "border-slate-400/10", text: "text-slate-400" };
      default: return { bg: "bg-secondary/40", border: "border-border", text: "text-muted-foreground" };
    }
  }, [homeTeam]);

  const awayTeamColor = useMemo(() => {
    const logo = awayTeam?.logo ?? "";
    switch (logo) {
      case "🔴": return { bg: "bg-red-500/5 hover:bg-red-500/10 transition-colors", border: "border-red-500/10", text: "text-red-500" };
      case "🔵": return { bg: "bg-blue-500/5 hover:bg-blue-500/10 transition-colors", border: "border-blue-500/10", text: "text-blue-500" };
      case "🟢": return { bg: "bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors", border: "border-emerald-500/10", text: "text-emerald-500" };
      case "🟠": return { bg: "bg-orange-500/5 hover:bg-orange-500/10 transition-colors", border: "border-orange-500/10", text: "text-orange-500" };
      case "🟡": return { bg: "bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors", border: "border-yellow-500/10", text: "text-yellow-500" };
      case "🟤": return { bg: "bg-amber-700/5 hover:bg-amber-700/10 transition-colors", border: "border-amber-700/10", text: "text-amber-600" };
      case "⚪": return { bg: "bg-slate-400/5 hover:bg-slate-400/10 transition-colors", border: "border-slate-400/10", text: "text-slate-400" };
      default: return { bg: "bg-secondary/40", border: "border-border", text: "text-muted-foreground" };
    }
  }, [awayTeam]);

  // Star Rating Distribution Calculations
  const { distributionList, totalParticipants } = useMemo(() => {
    if (!statsData?.distributionMap) {
      return { distributionList: [], totalParticipants: 0 };
    }
    const map = statsData.distributionMap;
    
    // Group the 0-10 points into 5 ranges
    const groups = [
      { stars: "4~5", keys: ["9", "10"] },
      { stars: "3~4", keys: ["7", "8"] },
      { stars: "2~3", keys: ["5", "6"] },
      { stars: "1~2", keys: ["3", "4"] },
      { stars: "0~1", keys: ["0", "1", "2"] },
    ];
    
    const data = groups.map((g) => {
      const count = g.keys.reduce((sum, key) => sum + Number(map[key] || 0), 0);
      return {
        stars: g.stars,
        count,
      };
    });
    
    const maxVal = Math.max(...data.map(d => d.count), 1);
    const totalCount = data.reduce((sum, d) => sum + d.count, 0);
    
    const list = data.map((d) => ({
      ...d,
      percentage: totalCount > 0 ? (d.count / totalCount) * 100 : 0,
      scalePercentage: (d.count / maxVal) * 100,
    }));

    return { distributionList: list, totalParticipants: totalCount };
  }, [statsData?.distributionMap]);

  // Fan distribution calculations based on API stats with fallback
  const { homeCount, awayCount, neutralCount, totalFans, homePct, awayPct, neutralPct } = useMemo(() => {
    const home = statsData?.homeCount !== undefined ? Number(statsData.homeCount) : (Math.floor((matchId * 17) % 50) + 25);
    const away = statsData?.awayCount !== undefined ? Number(statsData.awayCount) : (Math.floor((matchId * 23) % 40) + 15);
    const neutral = statsData?.neutralCount !== undefined ? Number(statsData.neutralCount) : (Math.floor((matchId * 11) % 20) + 10);
    const total = home + away + neutral;
    return {
      homeCount: home,
      awayCount: away,
      neutralCount: neutral,
      totalFans: total,
      homePct: total > 0 ? (home / total) * 100 : 0,
      awayPct: total > 0 ? (away / total) * 100 : 0,
      neutralPct: total > 0 ? (neutral / total) * 100 : 0,
    };
  }, [matchId, statsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-5xl mx-auto px-4 py-32 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-pitch border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground font-display">경기 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-5xl mx-auto px-4 py-32 text-center">
          <p className="text-muted-foreground mb-4">경기를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate("/")} variant="outline" className="font-display">
            홈으로 이동
          </Button>
        </div>
      </div>
    );
  }

  const homeLineups = matchData.homeLineups?.responses ?? [];
  const awayLineups = matchData.awayLineups?.responses ?? [];

  const homeStarters = homeLineups.filter((p) => p.status === "STARTER");
  const homeSubs = homeLineups.filter((p) => p.status !== "STARTER");

  const awayStarters = awayLineups.filter((p) => p.status === "STARTER");
  const awaySubs = awayLineups.filter((p) => p.status !== "STARTER");

  const myPlayerReviews = matchPersonalQuery.data?.myPlayerReviews ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer font-display"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          전체 경기
        </button>

        {/* Compact & Clean Score Banner (De-emphasized relative to reviews) */}
        <div className="rounded-xl border border-border bg-card/40 backdrop-blur p-4 sm:p-5 mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider font-semibold font-display bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
              K리그 1 · R{matchData.round}
            </span>
            <span className="text-xs text-muted-foreground font-display flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              {formattedDate} · {matchData.location}
            </span>
            {matchData.reviewEndTime && (
              <ReviewCountdown deadline={matchData.reviewEndTime} />
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">{homeTeam?.logo ?? "⚽"}</span>
              <span className="font-display font-bold text-sm sm:text-base">{matchData.homeTeamName}</span>
              <span className="font-display font-black text-base sm:text-lg ml-1">{matchData.homeScore}</span>
            </div>
            <span className="text-xs text-muted-foreground font-bold">:</span>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-base sm:text-lg mr-1">{matchData.awayScore}</span>
              <span className="font-display font-bold text-sm sm:text-base">{matchData.awayTeamName}</span>
              <span className="text-xl sm:text-2xl">{awayTeam?.logo ?? "⚽"}</span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border/60 mb-6">
          <button
            onClick={() => setActiveTab("reviews")}
            className={cn(
              "flex-1 sm:flex-initial px-6 py-3 text-xs font-display font-bold border-b-2 transition-all cursor-pointer",
              activeTab === "reviews"
                ? "border-pitch text-pitch bg-pitch/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20"
            )}
          >
            리뷰 및 평점 분석
          </button>
          <button
            onClick={() => setActiveTab("lineup")}
            className={cn(
              "flex-1 sm:flex-initial px-6 py-3 text-xs font-display font-bold border-b-2 transition-all cursor-pointer",
              activeTab === "lineup"
                ? "border-pitch text-pitch bg-pitch/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20"
            )}
          >
            팀 라인업 & 선수 평점
          </button>
        </div>

        {/* TAB 1: REVIEWS & STATS (Default) */}
        {activeTab === "reviews" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Star distribution */}
              <div className="md:col-span-2 rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-pitch" />
                    <h3 className="font-display font-semibold text-xs text-foreground flex items-center gap-1.5">
                      경기 평점 분포
                      {totalParticipants > 0 && (
                        <span className="text-[10px] font-normal text-muted-foreground font-body">
                          ({totalParticipants}명 참여)
                        </span>
                      )}
                    </h3>
                  </div>
                  {statsData && (
                    <div className="flex items-center gap-2">
                      <RatingBadge rating={statsData.totalAverage} size="sm" />
                      <span className="text-xs text-muted-foreground font-display font-semibold">
                        평균 {statsData.totalAverage.toFixed(1)}점
                      </span>
                    </div>
                  )}
                </div>

                {/* Star Chart */}
                <div className="space-y-2.5">
                  {distributionList.length > 0 ? (
                    distributionList.map((item) => (
                      <div key={item.stars} className="flex items-center gap-3 text-xs font-display">
                        <span className="w-8 text-muted-foreground text-right">{item.stars}★</span>
                        <div className="flex-1 h-3 bg-secondary/35 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${item.scalePercentage}%` }}
                            className="h-full bg-gradient-to-r from-accent/70 to-accent rounded-full transition-all duration-500"
                          ></div>
                        </div>
                        <span className="w-10 text-muted-foreground text-left pl-1">
                          {item.count} ({item.percentage.toFixed(0)}%)
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-muted-foreground py-8">아직 별점 통계가 없습니다.</p>
                  )}
                </div>

                {/* Home/Away Fan Averages Comparison */}
                {statsData && (
                  <div className="pt-4 border-t border-border/40 grid grid-cols-2 gap-4">
                    {/* Home Team */}
                    <div className={cn("p-3 rounded-lg border flex flex-col items-center justify-center text-center gap-1", homeTeamColor.bg, homeTeamColor.border)}>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold font-display tracking-wider">
                        {homeTeam?.name ?? "홈팀"} 팬 평균
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={cn("font-display font-black text-lg", homeTeamColor.text)}>
                          {statsData.homeAverage.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">/ 5.0</span>
                      </div>
                      <div className="w-full mt-2 h-1.5 bg-secondary/35 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(statsData.homeAverage / 5) * 100}%` }}
                          className={cn("h-full rounded-full", logoColorMap[homeTeam?.logo ?? ""] || "bg-accent")}
                        ></div>
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className={cn("p-3 rounded-lg border flex flex-col items-center justify-center text-center gap-1", awayTeamColor.bg, awayTeamColor.border)}>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold font-display tracking-wider">
                        {awayTeam?.name ?? "원정팀"} 팬 평균
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={cn("font-display font-black text-lg", awayTeamColor.text)}>
                          {statsData.awayAverage.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">/ 5.0</span>
                      </div>
                      <div className="w-full mt-2 h-1.5 bg-secondary/35 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(statsData.awayAverage / 5) * 100}%` }}
                          className={cn("h-full rounded-full", logoColorMap[awayTeam?.logo ?? ""] || "bg-accent")}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fan Participation Distribution */}
                {statsData && (
                  <div className="pt-4 border-t border-border/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold font-display tracking-wider">
                        리뷰 참여 분포 (팬 성향)
                      </span>
                      <span className="text-[10px] text-muted-foreground font-display">
                        총 {totalFans}명 참여
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-secondary/20">
                      <div
                        style={{ width: `${homePct}%` }}
                        className={cn("h-full transition-all duration-500 relative group cursor-pointer", logoColorMap[homeTeam?.logo ?? ""] || "bg-red-500")}
                        title={`${homeTeam?.name ?? "홈팀"} 팬: ${homePct.toFixed(1)}%`}
                      ></div>
                      <div
                        style={{ width: `${awayPct}%` }}
                        className={cn("h-full transition-all duration-500 relative group cursor-pointer", logoColorMap[awayTeam?.logo ?? ""] || "bg-blue-500")}
                        title={`${awayTeam?.name ?? "원정팀"} 팬: ${awayPct.toFixed(1)}%`}
                      ></div>
                      <div
                        style={{ width: `${neutralPct}%` }}
                        className="h-full bg-slate-400 transition-all duration-500 relative group cursor-pointer"
                        title={`중립: ${neutralPct.toFixed(1)}%`}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-display pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("w-2 h-2 rounded-full", logoColorMap[homeTeam?.logo ?? ""] || "bg-red-500")}></span>
                        <span>{homeTeam?.name ?? "홈팀"} 팬 {homeCount}명 ({homePct.toFixed(0)}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("w-2 h-2 rounded-full", logoColorMap[awayTeam?.logo ?? ""] || "bg-blue-500")}></span>
                        <span>{awayTeam?.name ?? "원정팀"} 팬 {awayCount}명 ({awayPct.toFixed(0)}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        <span>중립 {neutralCount}명 ({neutralPct.toFixed(0)}%)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Highlights MOM / Top 3 */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center gap-1.5 border-b border-border/40 pb-2">
                  <Award className="w-4 h-4 text-pitch" />
                  <h3 className="font-display font-semibold text-xs text-foreground">팬들이 뽑은 수훈 선수</h3>
                </div>

                <div className="space-y-4">
                  {/* Man of the Match */}
                  {statsData?.highlights?.mom ? (
                    <div className="p-3.5 rounded-lg border border-accent/25 bg-accent/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Crown className="w-6 h-6 text-accent shrink-0" />
                        <div>
                          <p className="text-[9px] text-accent font-semibold tracking-wider font-display uppercase">Man Of The Match</p>
                          <h4 className="font-display font-bold text-xs text-foreground mt-0.5">{statsData.highlights.mom.name}</h4>
                        </div>
                      </div>
                      <RatingBadge rating={statsData.highlights.mom.averageRating} size="md" />
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-border rounded-lg text-center text-xs text-muted-foreground">
                      아직 MOM 투표 데이터가 없습니다.
                    </div>
                  )}

                  {/* Top 3 */}
                  {statsData?.highlights?.top3 && statsData.highlights.top3.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold font-display tracking-wider">Top 3 Players</p>
                      <div className="space-y-1.5">
                        {statsData.highlights.top3.map((player, idx) => (
                          <div key={player.playerId} className="flex items-center justify-between p-2 rounded bg-secondary/30 border border-border/40 text-xs">
                            <span className="font-display font-semibold text-muted-foreground w-4 text-center">{idx + 1}</span>
                            <span className="font-medium text-foreground flex-1 pl-2 truncate">{player.name}</span>
                            <RatingBadge rating={player.averageRating} size="sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Leave match review */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className={cn("w-4 h-4", isReviewExpired ? "text-muted-foreground" : "text-pitch animate-pulse")} />
                <h3 className="font-display font-semibold text-foreground text-xs">
                  {isReviewExpired
                    ? (myReview ? "내 한줄평" : "리뷰 기간 종료")
                    : (myReview && !isEditing ? "내 한줄평" : myReview ? "매치 평점 및 한줄평 수정" : "이 경기를 직접 평가해 보세요")}
                </h3>
              </div>

              {isLoggedIn ? (
                <div className="space-y-4">
                  {myReview && !isEditing ? (
                    // Submitted Review Display
                    <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 space-y-3 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StarRating rating={myReview.rating / 2} size="md" />
                          <span className="font-display font-black text-accent text-sm">
                            {(myReview.rating / 2).toFixed(1)} / 5.0
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {!isReviewExpired && (
                            <Button
                              onClick={() => setIsEditing(true)}
                              size="sm"
                              variant="outline"
                              className="border-accent/30 text-accent hover:bg-accent/10 hover:text-accent font-display text-xs cursor-pointer"
                            >
                              리뷰 수정하기
                            </Button>
                          )}
                          <Button
                            onClick={handleReviewDelete}
                            disabled={deleteMatchReviewMutation.isPending}
                            size="sm"
                            variant="outline"
                            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive font-display text-xs cursor-pointer"
                          >
                            {deleteMatchReviewMutation.isPending ? "삭제 중..." : "리뷰 삭제하기"}
                          </Button>
                        </div>
                      </div>
                      {myReview.comment ? (
                        <p className="text-xs text-secondary-foreground leading-relaxed whitespace-pre-line bg-secondary/15 p-3 rounded border border-border/40">
                          {myReview.comment}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic bg-secondary/15 p-3 rounded border border-border/40">남긴 한줄평 내용이 없습니다.</p>
                      )}
                      <div className="flex items-center justify-between border-t border-border/20 pt-2.5 mt-2">
                        <button
                          onClick={() => handleLikeToggle(myReview.reviewId)}
                          className={cn(
                            "flex items-center gap-1.5 text-xs transition-colors py-1 px-2 rounded-md hover:bg-secondary cursor-pointer",
                            myReview.isLiked ? "text-rose-500 font-semibold" : "text-muted-foreground"
                          )}
                        >
                          <Heart className={cn("w-3.5 h-3.5", myReview.isLiked && "fill-rose-500 text-rose-500")} />
                          <span>{myReview.likeCount || 0}</span>
                        </button>
                      </div>
                    </div>
                  ) : isReviewExpired ? (
                    // Review expired - show notice instead of form
                    <div className="border border-red-500/20 rounded-lg p-4 bg-red-500/5 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-red-400 text-base">⏱</span>
                      </div>
                      <div>
                        <p className="text-xs font-display font-semibold text-red-400 mb-0.5">리뷰 기간이 종료되었습니다</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          이 경기의 리뷰 작성 기간이 마감되어 새로운 평점이나 한줄평을 남길 수 없습니다.
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <StarRating rating={userRating} size="lg" interactive onRate={setUserRating} />
                        {userRating > 0 && (
                          <span className="font-display font-bold text-accent text-xl">
                            {userRating.toFixed(1)} / 5.0
                          </span>
                        )}
                      </div>
                      
                      {userRating > 0 && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          <div className="relative">
                            <textarea
                              value={reviewContent}
                              onChange={(e) => setReviewContent(e.target.value)}
                              maxLength={100}
                              placeholder="경기에 대한 생생한 소감이나 리뷰를 남겨주세요... (선택)"
                              className="w-full rounded-md border border-border bg-secondary/30 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none h-20"
                            />
                            <span className={cn(
                              "block text-right text-[10px] mt-1 font-display",
                              reviewContent.length >= 100 ? "text-destructive font-semibold" : reviewContent.length >= 80 ? "text-amber-500" : "text-muted-foreground/60"
                            )}>
                              {reviewContent.length}/100
                            </span>
                          </div>
                          <div className="flex justify-end gap-2">
                            {myReview && (
                              <Button
                                onClick={() => {
                                  setUserRating(myReview.rating);
                                  setReviewContent(myReview.comment ?? "");
                                  setIsEditing(false);
                                }}
                                variant="ghost"
                                className="font-display text-xs text-muted-foreground hover:bg-secondary cursor-pointer"
                              >
                                취소
                              </Button>
                            )}
                            <Button
                              onClick={handleReviewSubmit}
                              disabled={
                                createMatchReviewMutation.isPending ||
                                updateMatchReviewMutation.isPending ||
                                userRating === 0
                              }
                              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs px-6 cursor-pointer"
                            >
                              {createMatchReviewMutation.isPending || updateMatchReviewMutation.isPending
                                ? "저장 중..."
                                : myReview
                                ? "수정 완료"
                                : "평가 등록"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/40 text-center">
                  <p className="text-xs text-muted-foreground mb-3">
                    로그인하면 이 경기에 대한 별점을 매기고 한줄평을 남길 수 있습니다.
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs cursor-pointer"
                  >
                    로그인 하러 가기
                  </Button>
                </div>
              )}
            </div>

            {/* Hot Reviews List */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-2">
                <MessageSquare className="w-4 h-4 text-pitch" />
                <h3 className="font-display font-semibold text-foreground text-xs">
                  팬들의 실시간 인기 리뷰
                </h3>
              </div>

              {matchHotReviewsQuery.isLoading ? (
                <p className="text-xs text-muted-foreground text-center py-8">리뷰 로딩 중...</p>
              ) : matchHotReviewsQuery.data && matchHotReviewsQuery.data.length > 0 ? (
                <div className="space-y-3.5">
                  {matchHotReviewsQuery.data.map((review) => (
                    <ReviewCard
                      key={review.reviewId}
                      review={{
                        id: review.reviewId,
                        author: review.authorNickname,
                        rating: review.point / 2,
                        text: review.content ?? "",
                        likes: review.likeCount,
                        isLiked: review.isLiked,
                        fanType: review.fanType,
                        isModified: review.isModified,
                      }}
                      onLikeToggle={() => handleLikeToggle(review.reviewId)}
                    />
                  ))}

                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={() => navigate(`/match/${matchId}/reviews`)}
                      variant="outline"
                      className="font-display text-xs px-6 hover:bg-secondary border-border/60 hover:text-foreground cursor-pointer"
                    >
                      리뷰 전체보기 (더보기)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 rounded-lg bg-secondary/10 border border-border/40">
                  <p className="text-xs text-muted-foreground">아직 이 경기에 대한 한줄평이 없습니다.</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">경기를 보고 느낀 소감을 첫 번째 리뷰로 남겨주세요!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LINEUPS */}
        {activeTab === "lineup" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2 mb-4">
              <Users className="w-4 h-4 text-pitch" />
              <h3 className="font-display font-semibold text-foreground text-xs">선수 평가</h3>
              <span className="text-[10px] text-muted-foreground ml-auto">선수 카드를 클릭하면 상세한 평가를 남길 수 있습니다.</span>
            </div>

            {homeLineups.length === 0 && awayLineups.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-12 bg-secondary/15 rounded-lg border border-border/40">
                라인업 정보가 아직 업데이트되지 않았습니다.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Home Team */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <h4 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                      <span className="text-lg">{homeTeam?.logo ?? "🔴"}</span>
                      {matchData.homeTeamName}
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-[10px] text-muted-foreground uppercase font-semibold font-display tracking-wider mb-2">선발 명단</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {homeStarters.map((player) => {
                          const myEval = myPlayerReviews.find((pr) => pr.playerId === player.playerId) ?? null;
                          return (
                            <PlayerRatingCard
                              key={player.playerId}
                              player={player}
                              matchId={matchId}
                              myEvaluation={myEval}
                              isFanOfThisTeam={homeTeam?.id === myTeamId}
                              isReviewExpired={isReviewExpired}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {homeSubs.length > 0 && (
                      <div>
                        <h5 className="text-[10px] text-muted-foreground uppercase font-semibold font-display tracking-wider mb-2 mt-4">교체 및 대기</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {homeSubs.map((player) => {
                            const myEval = myPlayerReviews.find((pr) => pr.playerId === player.playerId) ?? null;
                            return (
                              <PlayerRatingCard
                                key={player.playerId}
                                player={player}
                                matchId={matchId}
                                myEvaluation={myEval}
                                isFanOfThisTeam={homeTeam?.id === myTeamId}
                                isReviewExpired={isReviewExpired}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Away Team */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <h4 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                      <span className="text-lg">{awayTeam?.logo ?? "🔵"}</span>
                      {matchData.awayTeamName}
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-[10px] text-muted-foreground uppercase font-semibold font-display tracking-wider mb-2">선발 명단</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {awayStarters.map((player) => {
                          const myEval = myPlayerReviews.find((pr) => pr.playerId === player.playerId) ?? null;
                          return (
                            <PlayerRatingCard
                              key={player.playerId}
                              player={player}
                              matchId={matchId}
                              myEvaluation={myEval}
                              isFanOfThisTeam={awayTeam?.id === myTeamId}
                              isReviewExpired={isReviewExpired}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {awaySubs.length > 0 && (
                      <div>
                        <h5 className="text-[10px] text-muted-foreground uppercase font-semibold font-display tracking-wider mb-2 mt-4">교체 및 대기</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {awaySubs.map((player) => {
                            const myEval = myPlayerReviews.find((pr) => pr.playerId === player.playerId) ?? null;
                            return (
                              <PlayerRatingCard
                                key={player.playerId}
                                player={player}
                                matchId={matchId}
                                myEvaluation={myEval}
                                isFanOfThisTeam={awayTeam?.id === myTeamId}
                                isReviewExpired={isReviewExpired}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MatchDetail;
