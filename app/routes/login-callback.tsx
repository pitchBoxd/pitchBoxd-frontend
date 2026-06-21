import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Loader2, Tv, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, TEAM_NUMBER_ID_MAP } from "@/contexts/AuthContext";
import { getMyInfo } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

const LoginCallback = () => {
  const navigate = useNavigate();
  const { loginWithUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    let cancelled = false;

    const accessToken = getCookie("accessToken");
    const signupToken = getCookie("signupToken");

    // accessToken이 없고 signupToken만 존재할 때 신규 회원으로 판단하여 회원가입 페이지로 보냅니다.
    // 기존 회원은 accessToken이 존재하므로 이 단계를 건너뜁니다.
    if (!accessToken && signupToken) {
      navigate("/signup", { replace: true });
      return;
    }

    (async () => {
      try {
        const me = await getMyInfo();

        if (cancelled) return;
        const mappedTeamId = me.favoriteTeamId ? TEAM_NUMBER_ID_MAP[me.favoriteTeamId] : null;
        const storedTeamId = mappedTeamId || (typeof window !== "undefined" ? localStorage.getItem(`favoriteTeam_${me.id}`) : null);

        loginWithUser({
          id: me.id,
          nickname: me.nickname,
          myTeamId: storedTeamId || undefined,
        });
        // 로그인 성공 시 미처 지워지지 않은 signupToken 쿠키가 있다면 정리합니다.
        deleteCookie("signupToken");
        navigate("/", { replace: true });
      } catch (e) {
        if (cancelled) return;
        if (e instanceof ApiError) {
          setError(`로그인에 실패했습니다 (HTTP ${e.status}).`);
        } else {
          setError(
            e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      ran.current = false;
    };
  }, [navigate, loginWithUser]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-card p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-6">
            <Tv className="w-4 h-4 text-pitch" />
            <span className="text-xs uppercase tracking-[0.2em] font-display text-pitch">
              {error ? "Login Error" : "Signing in"}
            </span>
          </div>

          {error ? (
            <>
              <div className="flex items-start gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h1 className="font-display text-lg font-semibold text-foreground mb-1">
                    로그인을 완료하지 못했어요
                  </h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => navigate("/login", { replace: true })}
                className="w-full"
              >
                다시 시도하기
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-pitch animate-spin" />
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">
                  PitchBoxd에 입장하는 중…
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Google 계정을 확인하고 있어요.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginCallback;
