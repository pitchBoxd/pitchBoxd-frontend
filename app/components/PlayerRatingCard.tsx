import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { type LineupResponse, type MyPlayerReviewResponse } from "@/lib/api/types";
import { allPlayers, playerReviews } from "@/data/mockData";
import { RatingBadge } from "./RatingBadge";
import { StarRating } from "./StarRating";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api/client";
import { toast } from "sonner";
import { useCreatePlayerReview, useUpdatePlayerReview, useDeletePlayerReview, useTogglePlayerReviewLike, usePlayerReviews } from "@/lib/queries/matches";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface PlayerRatingCardProps {
  player: LineupResponse;
  matchId: number;
  myEvaluation: MyPlayerReviewResponse | null;
  isFanOfThisTeam?: boolean;
  isReviewExpired?: boolean;
}

export const PlayerRatingCard = ({ player, matchId, myEvaluation, isFanOfThisTeam = false, isReviewExpired = false }: PlayerRatingCardProps) => {
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useAuth();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [likedState, setLikedState] = useState<Record<string | number, boolean>>({});

  const createPlayerReviewMutation = useCreatePlayerReview();
  const updatePlayerReviewMutation = useUpdatePlayerReview();
  const deletePlayerReviewMutation = useDeletePlayerReview();
  const togglePlayerReviewLikeMutation = useTogglePlayerReviewLike();

  // Keep rating & comment state synced with user's evaluation
  useEffect(() => {
    if (myEvaluation) {
      setRating(myEvaluation.rating / 2);
      setComment(myEvaluation.comment ?? "");
      setIsEditing(false);
    } else {
      setRating(0);
      setComment("");
      setIsEditing(false);
    }
  }, [myEvaluation, open]);

  // Load player reviews only when the lineup card dialog is open
  const { data: reviewsData, isLoading: isReviewsLoading } = usePlayerReviews(
    matchId,
    player.playerId,
    userId,
    open
  );

  // Sync like state from API responses
  useEffect(() => {
    if (reviewsData?.reviews) {
      const initialLikes: Record<string | number, boolean> = {};
      reviewsData.reviews.forEach((r) => {
        initialLikes[r.id] = r.isLiked;
      });
      if (myEvaluation) {
        const myReviewInList = reviewsData.reviews.find((r) => r.id === myEvaluation.playerReviewId);
        initialLikes[myEvaluation.playerReviewId] = myReviewInList?.isLiked ?? false;
      }
      setLikedState((prev) => ({ ...initialLikes, ...prev }));
    }
  }, [reviewsData, myEvaluation]);

  // Map API reviews
  const apiReviews = useMemo(() => {
    if (!reviewsData?.reviews) return [];
    return reviewsData.reviews.map((r) => ({
      id: r.id,
      author: r.nickname + (r.favoriteTeamName ? ` (${r.favoriteTeamName})` : ""),
      rating: r.point / 2, // 0-10 -> 0-5 stars
      text: r.content || "",
      likes: r.likeCount,
      isLiked: r.isLiked,
      createdAt: r.createdAt,
    }));
  }, [reviewsData]);

  // Combine api reviews and user's own review if it exists
  const allReviews = useMemo(() => {
    const list = [...apiReviews];
    if (myEvaluation) {
      const exists = list.some(r => r.id === myEvaluation.playerReviewId);
      if (!exists) {
        list.unshift({
          id: myEvaluation.playerReviewId,
          author: "나",
          rating: myEvaluation.rating / 2,
          text: myEvaluation.comment ?? "",
          likes: 0,
          isLiked: false,
          createdAt: new Date().toISOString(),
        });
      }
    }
    return list;
  }, [apiReviews, myEvaluation]);

  const handleSubmit = () => {
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

    if (myEvaluation) {
      updatePlayerReviewMutation.mutate({
        playerReviewId: myEvaluation.playerReviewId,
        matchId,
        userId,
        body: {
          point: rating * 2,
          content: comment || undefined,
        },
      }, {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("선수 리뷰가 수정되었습니다.");
        },
        onError: (err) => handleError(err, "선수 리뷰 수정에 실패했습니다."),
      });
    } else {
      createPlayerReviewMutation.mutate({
        matchId,
        userId,
        body: {
          playerId: player.playerId,
          point: rating * 2,
          content: comment || undefined,
        },
      }, {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("선수 리뷰가 등록되었습니다.");
        },
        onError: (err) => handleError(err, "선수 리뷰 등록에 실패했습니다."),
      });
    }
  };

  const handleDelete = () => {
    if (!isLoggedIn || !userId || !myEvaluation) return;
    if (window.confirm("정말로 이 선수 리뷰를 삭제하시겠습니까?")) {
      deletePlayerReviewMutation.mutate({
        playerReviewId: myEvaluation.playerReviewId,
        matchId,
        userId,
      }, {
        onSuccess: () => {
          setIsEditing(false);
          setRating(0);
          setComment("");
        },
      });
    }
  };

  const handleLikeToggle = (reviewId: string | number) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setLikedState((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));

    const isMock = typeof reviewId === "string" || isNaN(Number(reviewId));
    if (!isMock && userId) {
      togglePlayerReviewLikeMutation.mutate({
        playerReviewId: Number(reviewId),
        userId,
      });
    }
  };

  const isSubmitting = createPlayerReviewMutation.isPending || updatePlayerReviewMutation.isPending;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-3 w-full p-3 text-left rounded-md border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer group",
          (player.status === "BENCH") && "opacity-75"
        )}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-secondary font-display text-xs font-bold text-secondary-foreground group-hover:bg-primary/15 group-hover:text-primary transition-colors">
          {player.backNumber}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate group-hover:text-pitch transition-colors">
            {player.playerName}
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground uppercase font-display">
              {player.status === "STARTER" ? "선발" : player.status === "SUBSTITUTED_IN" ? "교체출전" : "대기"}
            </span>
            {myEvaluation && (
              <span className="text-accent bg-accent/10 px-1.5 py-0.2 rounded font-semibold text-[10px]">
                평가완료
              </span>
            )}
          </div>
        </div>
        <RatingBadge rating={player.averageRating} size="sm" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border p-6 md:p-8">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-secondary font-display text-sm font-bold text-secondary-foreground">
                {player.backNumber}
              </div>
              <div>
                <DialogTitle className="text-foreground font-display text-base">
                  {player.playerName}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-xs mt-0.5">
                  <span className="font-semibold text-muted-foreground">
                    {player.status === "STARTER" ? "선발 명단" : player.status === "SUBSTITUTED_IN" ? "교체 선수" : "대기 명단"}
                  </span>
                </DialogDescription>
              </div>
              <div className="ml-auto flex flex-col items-end gap-0.5">
                <RatingBadge rating={player.averageRating} size="lg" />
                <span className="text-[10px] text-muted-foreground">평균 평점</span>
              </div>
            </div>
          </DialogHeader>

          {/* Rating Form or Submitted Display */}
          {isLoggedIn ? (
            myEvaluation && !isEditing ? (
              (() => {
                const myReviewInList = reviewsData?.reviews?.find((r) => r.id === myEvaluation.playerReviewId);
                const myEvaluationLikes = myReviewInList?.likeCount ?? 0;
                const myEvaluationIsLiked = myReviewInList?.isLiked ?? false;
                const isLiked = likedState[myEvaluation.playerReviewId] ?? myEvaluationIsLiked;

                return (
                  // Submitted Player Review Display
                  <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StarRating rating={myEvaluation.rating / 2} size="md" />
                        <span className="font-display font-black text-accent text-sm">
                          {(myEvaluation.rating / 2).toFixed(1)} / 5.0
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {isFanOfThisTeam && !isReviewExpired && (
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
                          onClick={handleDelete}
                          disabled={deletePlayerReviewMutation.isPending}
                          size="sm"
                          variant="outline"
                          className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive font-display text-xs cursor-pointer"
                        >
                          {deletePlayerReviewMutation.isPending ? "삭제 중..." : "리뷰 삭제하기"}
                        </Button>
                      </div>
                    </div>
                    {myEvaluation.comment ? (
                      <p className="text-xs text-secondary-foreground leading-relaxed whitespace-pre-line bg-secondary/15 p-3 rounded border border-border/40">
                        {myEvaluation.comment}
                        {myEvaluation.isModified && <span className="ml-1 text-[10px] text-muted-foreground/70">(수정됨)</span>}
                      </p>
                    ) : (
                      <div className="flex justify-between items-center text-xs text-muted-foreground italic bg-secondary/15 p-3 rounded border border-border/40">
                        <span>남긴 한줄평 내용이 없습니다.</span>
                        {myEvaluation.isModified && <span className="text-[10px] text-muted-foreground/70">(수정됨)</span>}
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-border/20 pt-2.5">
                      <button
                        onClick={() => handleLikeToggle(myEvaluation.playerReviewId)}
                        className={cn(
                          "flex items-center gap-1.5 text-xs transition-colors py-1 px-2 rounded-md hover:bg-secondary cursor-pointer",
                          isLiked ? "text-rose-500 font-semibold" : "text-muted-foreground"
                        )}
                      >
                        <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-rose-500 text-rose-500")} />
                        <span>{myEvaluationLikes + (isLiked ? 1 : 0) - (myEvaluationIsLiked ? 1 : 0)}</span>
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : isReviewExpired ? (
              // Review period expired notice
              <div className="border border-red-500/20 rounded-lg p-4 bg-red-500/5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-400 text-sm">⏱</span>
                </div>
                <div>
                  <p className="text-xs font-display font-semibold text-red-400 mb-0.5">리뷰 기간이 종료되었습니다</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    이 경기의 선수 평가 기간이 마감되어 새로운 평점을 남길 수 없습니다.
                  </p>
                </div>
              </div>
            ) : isFanOfThisTeam ? (
              // Edit/Create Form
              <div className="border border-border rounded-lg p-4 space-y-3 bg-secondary/20">
                <p className="text-xs font-display font-semibold text-foreground">
                  {myEvaluation ? "선수 평점 및 한줄평 수정" : "이 선수에게 평점 남기기"}
                </p>
                <div className="flex items-center gap-3">
                  <StarRating rating={rating} size="md" interactive onRate={setRating} />
                  {rating > 0 && (
                    <span className="font-display font-bold text-accent text-sm">
                      {rating.toFixed(1)} / 5.0
                    </span>
                  )}
                </div>
                <div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={100}
                    placeholder="선수의 활약에 대해 한줄평을 남겨주세요... (선택)"
                    className="w-full rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none h-24"
                  />
                  <span className={cn(
                    "block text-right text-[10px] mt-1 font-display",
                    comment.length >= 100 ? "text-destructive font-semibold" : comment.length >= 80 ? "text-amber-500" : "text-muted-foreground/60"
                  )}>
                    {comment.length}/100
                  </span>
                </div>
                <div className="flex justify-end gap-2">
                  {myEvaluation && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setRating(myEvaluation.rating / 2);
                        setComment(myEvaluation.comment ?? "");
                        setIsEditing(false);
                      }}
                      className="font-display text-xs text-muted-foreground hover:bg-secondary cursor-pointer"
                    >
                      취소
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={rating === 0 || isSubmitting}
                    onClick={handleSubmit}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs px-4"
                  >
                    {isSubmitting ? "제출 중..." : myEvaluation ? "수정 완료" : "평가 제출"}
                  </Button>
                </div>
              </div>
            ) : (
              // Blocked Message
              <div className="border border-border rounded-lg p-5 text-center bg-secondary/20 space-y-3">
                <p className="text-xs text-muted-foreground">
                  이 선수의 소속 팀 팬만 평가를 남길 수 있습니다.
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs cursor-pointer"
                >
                  마이팀 설정하러 가기
                </Button>
              </div>
            )
          ) : (
            <div className="border border-border rounded-lg p-5 text-center bg-secondary/20 space-y-3">
              <p className="text-xs text-muted-foreground">로그인 후 선수를 평가하고 한줄평을 남겨보세요!</p>
              <Button
                size="sm"
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs cursor-pointer"
              >
                로그인 하러 가기
              </Button>
            </div>
          )}

          {/* Other reviews */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-display font-semibold text-foreground">
              전체 리뷰 ({isReviewsLoading ? "..." : allReviews.length})
            </p>
            {isReviewsLoading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 bg-secondary/5 rounded-md border border-border/40">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] text-muted-foreground font-display">리뷰를 불러오는 중...</p>
              </div>
            ) : allReviews.length > 0 ? (
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {allReviews.map((review) => {
                  const isLiked = likedState[review.id] ?? review.isLiked ?? false;
                  return (
                    <div key={review.id} className="rounded-md border border-border bg-background/50 p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-muted-foreground">{review.author}</span>
                        <div className="flex items-center gap-1.5">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-xs font-display font-bold text-accent">{review.rating}</span>
                        </div>
                      </div>
                      {review.text && (
                        <p className="text-xs text-secondary-foreground leading-relaxed">{review.text}</p>
                      )}
                      <button
                        onClick={() => handleLikeToggle(review.id)}
                        className={cn(
                          "flex items-center gap-1 text-[10px] transition-colors py-0.5 px-1.5 rounded hover:bg-secondary cursor-pointer",
                          isLiked ? "text-rose-500 font-semibold" : "text-muted-foreground"
                        )}
                      >
                        <Heart className={cn("w-3 h-3", isLiked && "fill-rose-500 text-rose-500")} />
                        <span>{review.likes + (isLiked ? 1 : 0) - (review.isLiked ? 1 : 0)}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4 bg-secondary/10 rounded-md border border-border/40">
                아직 이 선수에 대한 평가가 없습니다. 첫 평가를 남겨보세요!
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
