import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center relative overflow-hidden">
      {/* Neon Radial Glow Effect */}
      <div className="absolute w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full space-y-6">
        {/* Animated Compass Icon */}
        <div className="flex justify-center">
          <div className="p-5 bg-secondary/35 border border-border/60 rounded-full animate-bounce duration-1000">
            <Compass className="w-16 h-16 text-primary animate-spin" style={{ animationDuration: '10s' }} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-8xl font-black text-primary tracking-tight">404</h1>
          <h2 className="text-lg font-bold text-foreground font-body">오프사이드! 🚩</h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-body">
            요청하신 페이지가 존재하지 않거나 잘못된 경로입니다.<br />
            입력하신 주소를 다시 한번 확인해 주세요.
          </p>
        </div>

        {/* Countdown Visualizer */}
        <div className="bg-secondary/40 border border-border/40 p-4 rounded-xl flex items-center justify-between text-xs font-display">
          <span className="text-muted-foreground font-body">자동 이동</span>
          <div className="flex items-center gap-1.5 font-bold text-primary">
            <span className="tabular-nums animate-pulse">{countdown}초 후 홈 화면으로 이동</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Action Button */}
        <div>
          <Button
            onClick={() => navigate("/", { replace: true })}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs cursor-pointer py-5"
          >
            지금 즉시 홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
