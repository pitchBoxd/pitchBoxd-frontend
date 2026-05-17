import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import { ReviewCard } from "@/components/ReviewCard";
import { TrendingUp, Flame, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useReviewableMatches } from "@/lib/queries/matches";
import { useHotReviews } from "@/lib/queries/reviews";
import { toMatch } from "@/lib/adapters/match";
import type { Review } from "@/data/mockData";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userId, myTeamId } = useAuth();

  const matchesQuery = useReviewableMatches(userId);
  const hotReviewsQuery = useHotReviews(5);

  const matches = useMemo(
    () => (matchesQuery.data ?? []).map(toMatch),
    [matchesQuery.data],
  );

  const myTeamMatch = useMemo(() => {
    if (!isLoggedIn || !myTeamId) return null;
    return (
      matches.find(
        (m) => m.homeTeamId === myTeamId || m.awayTeamId === myTeamId,
      ) ?? null
    );
  }, [isLoggedIn, myTeamId, matches]);

  const otherMatches = useMemo(() => {
    if (!myTeamMatch) return matches;
    return matches.filter((m) => m.id !== myTeamMatch.id);
  }, [matches, myTeamMatch]);

  const hotReviews = useMemo<Review[]>(
    () =>
      (hotReviewsQuery.data ?? []).map((r) => ({
        id: String(r.id),
        author: r.authorNickname,
        rating: r.rating,
        text: r.content,
        likes: Number(r.likeCount),
        createdAt: "",
      })),
    [hotReviewsQuery.data],
  );

  const handleMatchClick = (id: string) => navigate(`/match/${id}`);

  const isMatchesLoading = matchesQuery.isLoading && userId !== null;
  const isAnonymous = userId === null;

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

        {myTeamMatch && (
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

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-foreground text-sm">
            리뷰할 수 있는 경기
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {isMatchesLoading ? (
            <p className="col-span-2 text-center text-sm text-muted-foreground py-8">
              불러오는 중…
            </p>
          ) : isAnonymous ? (
            <p className="col-span-2 text-center text-sm text-muted-foreground py-8">
              로그인하면 평가할 수 있는 경기 목록을 볼 수 있어요.
            </p>
          ) : otherMatches.length > 0 ? (
            otherMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={handleMatchClick}
              />
            ))
          ) : (
            <p className="col-span-2 text-center text-sm text-muted-foreground py-8">
              평가할 수 있는 경기가 없습니다
            </p>
          )}
        </div>

        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-pitch" />
            <h2 className="font-display font-semibold text-foreground text-sm">
              가장 핫한 한줄평
            </h2>
          </div>
          <div className="space-y-3">
            {hotReviewsQuery.isLoading ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                불러오는 중…
              </p>
            ) : hotReviews.length > 0 ? (
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
