import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/GoogleIcon";
import { useAuth } from "@/contexts/AuthContext";
import { startGoogleLogin } from "@/lib/google-oauth";

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-card p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-6">
            <Tv className="w-4 h-4 text-pitch" />
            <span className="text-xs uppercase tracking-[0.2em] font-display text-pitch">
              K리그 1 · 2026
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
            팬의 시선으로,
            <br />
            <span className="text-pitch">경기를 기록하세요.</span>
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            PitchBoxd는 K리그 1 경기 리뷰와 선수 평점을 함께 모으는 플랫폼입니다.
            Google 계정으로 30초 만에 시작할 수 있어요.
          </p>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={startGoogleLogin}
            className="w-full justify-center gap-3 h-11 bg-card border-border hover:bg-surface-hover hover:border-primary/40 transition-all"
          >
            <GoogleIcon className="w-5 h-5" />
            <span className="font-body text-sm font-medium">
              Google 계정으로 계속하기
            </span>
          </Button>

          <p className="mt-6 text-[11px] text-muted-foreground leading-relaxed">
            계속 진행하면 PitchBoxd 서비스 이용약관 및 개인정보 처리방침에
            동의하는 것으로 간주됩니다.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          이미 로그인 했다면{" "}
          <button
            onClick={() => navigate("/")}
            className="text-pitch hover:underline underline-offset-2"
          >
            홈으로 돌아가기
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
