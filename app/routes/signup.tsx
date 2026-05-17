import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Tv, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { googleSignup } from "@/lib/api/auth";
import { getUserIdFromToken } from "@/lib/jwt";
import { ApiError } from "@/lib/api/client";
import type { GoogleUserInfo } from "@/lib/api/auth";

const PENDING_KEY = "pitchboxd_pending_signup";
const NICKNAME_MAX = 20;
const NICKNAME_RE = /^[\w가-힣ㄱ-ㅎㅏ-ㅣ_-]{2,20}$/;

interface PendingSignup {
  idToken: string;
  userInfo: GoogleUserInfo;
}

const Signup = () => {
  const navigate = useNavigate();
  const { loginWithUser } = useAuth();
  const [pending, setPending] = useState<PendingSignup | null>(null);
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) {
      navigate("/login", { replace: true });
      return;
    }
    try {
      const parsed = JSON.parse(raw) as PendingSignup;
      setPending(parsed);
      setNickname(parsed.userInfo.name?.slice(0, NICKNAME_MAX) ?? "");
    } catch {
      sessionStorage.removeItem(PENDING_KEY);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending) return;

    const trimmed = nickname.trim();
    if (!NICKNAME_RE.test(trimmed)) {
      setError(
        "닉네임은 2–20자, 한글/영문/숫자/_/- 만 사용할 수 있어요.",
      );
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const token = await googleSignup({
        idToken: pending.idToken,
        nickname: trimmed,
      });

      const userId = getUserIdFromToken(token.accessToken);
      if (userId === null) {
        throw new Error("토큰에서 사용자 ID를 읽을 수 없습니다.");
      }

      sessionStorage.removeItem(PENDING_KEY);
      loginWithUser({
        id: userId,
        nickname: trimmed,
        accessToken: token.accessToken,
      });
      navigate("/", { replace: true });
    } catch (e) {
      if (e instanceof ApiError) {
        setError(`가입 처리에 실패했습니다 (HTTP ${e.status}).`);
      } else {
        setError(
          e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!pending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-pitch animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-card p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-6">
            <Tv className="w-4 h-4 text-pitch" />
            <span className="text-xs uppercase tracking-[0.2em] font-display text-pitch">
              New Account
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground leading-tight mb-3">
            마지막 한 단계,
            <br />
            <span className="text-pitch">닉네임을 정해주세요.</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            평점과 한줄평에 표시될 이름이에요. 가입 후에도 변경할 수 있습니다.
          </p>

          <div className="flex items-center gap-3 mb-6 rounded-md border border-border bg-secondary/40 p-3">
            {pending.userInfo.picture ? (
              <img
                src={pending.userInfo.picture}
                alt=""
                className="w-9 h-9 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-pitch flex items-center justify-center font-display text-sm font-bold text-primary-foreground">
                {pending.userInfo.name?.[0] ?? "?"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {pending.userInfo.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {pending.userInfo.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="nickname"
                className="block text-xs uppercase tracking-[0.15em] font-display text-muted-foreground mb-2"
              >
                닉네임
              </label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={NICKNAME_MAX}
                placeholder="K리그팬_준호"
                autoFocus
                disabled={submitting}
              />
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground font-display tabular-nums">
                <span>2–20자 · 한글/영문/숫자/_/-</span>
                <span>
                  {nickname.length}/{NICKNAME_MAX}
                </span>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-11"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "PitchBoxd 시작하기"
              )}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(PENDING_KEY);
              navigate("/login", { replace: true });
            }}
            className="mt-6 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            다른 Google 계정으로 다시 시도
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
