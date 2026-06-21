import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import { TrendingUp, Heart, LogIn, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeData } from "@/lib/queries/reviews";
import { toMatch } from "@/lib/adapters/match";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userId, myTeamId } = useAuth();

  const homeParams = useMemo(() => {
    return { state: "REVIEWABLE" as const };
  }, []);

  const homeDataQuery = useHomeData(homeParams);

  const matchItems = useMemo(() => {
    return (homeDataQuery.data?.responses ?? []).map((r) => {
      const match = toMatch(r.matchResponse);
      const reviews = r.hotReviews.map((hr) => ({
        id: String(hr.id),
        author: hr.authorNickname,
        rating: hr.rating / 2,
        text: hr.content,
        likes: Number(hr.likeCount),
        createdAt: "",
      }));
      return { match, reviews };
    });
  }, [homeDataQuery.data]);

  const myTeamMatchItems = useMemo(() => {
    if (!isLoggedIn || !myTeamId) return [];
    return matchItems.filter(
      (item) => item.match.homeTeamId === myTeamId || item.match.awayTeamId === myTeamId,
    );
  }, [isLoggedIn, myTeamId, matchItems]);

  const otherMatchItems = useMemo(() => {
    if (myTeamMatchItems.length === 0) return matchItems;
    const myTeamMatchIds = new Set(myTeamMatchItems.map((item) => item.match.id));
    return matchItems.filter((item) => !myTeamMatchIds.has(item.match.id));
  }, [matchItems, myTeamMatchItems]);

  const handleMatchClick = (id: string) => navigate(`/match/${id}`);

  const isMatchesLoading = homeDataQuery.isLoading;

  const [activeMyTeamIndex, setActiveMyTeamIndex] = useState(0);
  const myTeamScrollRef = useRef<HTMLDivElement>(null);

  const handleMyTeamScroll = () => {
    if (!myTeamScrollRef.current) return;
    const container = myTeamScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const firstChild = container.firstElementChild as HTMLElement | null;
    if (!firstChild) return;
    const itemWidth = firstChild.offsetWidth;
    const gap = 16; // gap-4 is 16px (1rem)
    const index = Math.min(
      Math.max(0, Math.round(scrollLeft / (itemWidth + gap))),
      myTeamMatchItems.length - 1
    );
    setActiveMyTeamIndex(index);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-5xl mx-auto px-4 py-10">
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

        {/* Guest user login prompt banner */}
        {!isLoggedIn && (
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-between p-5 rounded-lg border border-primary/30 bg-gradient-to-br from-card to-secondary/10 hover:border-primary/50 transition-all duration-200 cursor-pointer text-left mb-8 group"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <LogIn className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-display font-semibold text-foreground text-sm flex items-center gap-1.5 flex-wrap">
                  로그인하고 K리그 기록을 함께해 보세요!
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/15 px-1.5 py-0.5 rounded">
                    입장하기
                  </span>
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  구글 계정으로 3초 만에 시작하여 평점 주기와 매치 리뷰 작성을 진행할 수 있습니다.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 ml-4" />
          </button>
        )}

        {/* Favorite team prompt banner for logged-in users who haven't set their team */}
        {isLoggedIn && !myTeamId && (
          <button
            onClick={() => navigate("/profile")}
            className="w-full flex items-center justify-between p-5 rounded-lg border border-pitch/30 bg-gradient-to-br from-card to-pitch-dim/10 hover:border-pitch/50 transition-all duration-200 cursor-pointer text-left mb-8 group"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-pitch/10 flex items-center justify-center text-pitch shrink-0">
                <Heart className="w-5 h-5 fill-pitch animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-display font-semibold text-foreground text-sm flex items-center gap-1.5 flex-wrap">
                  아직 응원하는 팀이 없으신가요?
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-pitch bg-pitch/15 px-1.5 py-0.5 rounded">
                    설정 필요
                  </span>
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  마이페이지에서 응원 팀을 등록하고 편하게 경기 소식을 모아보세요.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 ml-4" />
          </button>
        )}

        {/* Featured favorite team matches */}
        {myTeamMatchItems.length > 0 && (
          <div className="mb-8">
            {myTeamMatchItems.length === 1 ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-pitch fill-pitch animate-pulse" />
                  <span className="font-display text-xs font-semibold text-pitch uppercase tracking-wider">
                    My Team
                  </span>
                </div>
                <MatchCard
                  match={myTeamMatchItems[0].match}
                  onClick={handleMatchClick}
                  featured
                  reviews={myTeamMatchItems[0].reviews.slice(0, 3)}
                />
              </div>
            ) : (
              <div className="relative group/slider">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pitch fill-pitch animate-pulse" />
                    <span className="font-display text-xs font-semibold text-pitch uppercase tracking-wider">
                      My Team Matches ({myTeamMatchItems.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {myTeamMatchItems.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!myTeamScrollRef.current) return;
                          const container = myTeamScrollRef.current;
                          const firstChild = container.firstElementChild as HTMLElement | null;
                          if (!firstChild) return;
                          const itemWidth = firstChild.offsetWidth;
                          const gap = 16;
                          container.scrollTo({
                            left: idx * (itemWidth + gap),
                            behavior: "smooth",
                          });
                        }}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-300",
                          idx === activeMyTeamIndex
                            ? "bg-pitch w-3"
                            : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div
                    ref={myTeamScrollRef}
                    onScroll={handleMyTeamScroll}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
                  >
                    {myTeamMatchItems.map((item, index) => {
                      const isActive = index === activeMyTeamIndex;
                      return (
                        <div
                          key={item.match.id}
                          className={cn(
                            "snap-start shrink-0 w-[85%] sm:w-[75%] md:w-[65%] transition-all duration-300 ease-in-out cursor-pointer",
                            isActive
                              ? "opacity-100 scale-100"
                              : "opacity-40 hover:opacity-60 scale-[0.98] blur-[0.3px]"
                          )}
                        >
                          <MatchCard
                            match={item.match}
                            onClick={handleMatchClick}
                            featured
                            reviews={item.reviews.slice(0, 3)}
                          />
                        </div>
                      );
                    })}
                    {/* Extra spacer at the end to allow the last card to align nicely with right padding */}
                    <div className="shrink-0 w-[15vw] sm:w-[25vw] md:w-[35vw]" />
                  </div>

                  {/* Faded overlay indicator on the right edge */}
                  <div className="absolute top-0 right-0 bottom-4 w-24 bg-gradient-to-l from-background via-background/40 to-transparent pointer-events-none z-10" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-foreground text-sm flex items-center gap-1.5">
            🕒 리뷰할 수 있는 경기
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {isMatchesLoading ? (
            <p className="col-span-2 text-center text-sm text-muted-foreground py-8">
              불러오는 중…
            </p>
          ) : otherMatchItems.length > 0 ? (
            otherMatchItems.map(({ match, reviews }) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={handleMatchClick}
                reviews={reviews.slice(0, 1)}
              />
            ))
          ) : (
            <p className="col-span-2 text-center text-sm text-muted-foreground py-8">
              평가할 수 있는 경기가 없습니다
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
