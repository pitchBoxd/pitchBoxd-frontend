import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Loader2, Tv, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { consumeStoredState } from "@/lib/google-oauth";
import { googleLogin, getMyInfo, type GoogleUserInfo } from "@/lib/api/auth";
import { getUserIdFromToken } from "@/lib/jwt";
import { ApiError } from "@/lib/api/client";

const PENDING_KEY = "pitchboxd_pending_signup";

export interface PendingSignup {
  idToken: string;
  userInfo: GoogleUserInfo;
}

const LoginCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = params.get("code");
    const state = params.get("state");
    const oauthError = params.get("error");

    if (oauthError) {
      setError(`Google 인증이 취소되었습니다 (${oauthError})`);
      return;
    }

    if (!code) {
      setError("인증 코드가 전달되지 않았습니다.");
      return;
    }

    const storedState = consumeStoredState();
    if (storedState && state && storedState !== state) {
      setError("보안 상태값이 일치하지 않습니다. 다시 시도해 주세요.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await googleLogin({ authorizationCode: code });

        if (!response.isRegistered) {
          const pending: PendingSignup = {
            idToken: response.idToken,
            userInfo: response.userInfo,
          };
          sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
          if (!cancelled) navigate("/signup", { replace: true });
          return;
        }

        const userId = getUserIdFromToken(response.accessToken);
        if (userId === null) {
          throw new Error("토큰에서 사용자 ID를 읽을 수 없습니다.");
        }

        let nickname = response.userInfo.name;
        try {
          const me = await getMyInfo(userId);
          nickname = me.nickname || nickname;
        } catch {
          // ignore, fall back to Google profile name
        }

        if (cancelled) return;
        loginWithUser({
          id: userId,
          nickname,
          accessToken: response.accessToken,
        });
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
    };
  }, [params, navigate, loginWithUser]);

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
