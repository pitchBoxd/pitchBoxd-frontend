import { useEffect, useState } from "react";
import { Clock, AlertTriangle, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCountdownProps {
  deadline: string;
  className?: string;
  onExpire?: () => void;
  showExpired?: boolean;
}

export const ReviewCountdown = ({
  deadline,
  className,
  onExpire,
  showExpired = true,
}: ReviewCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  } | null>(null);

  useEffect(() => {
    const targetTime = new Date(deadline).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
        if (onExpire) onExpire();
        return false;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, totalMs: diff });
      return true;
    };

    updateTimer();
    const interval = setInterval(() => {
      const isRunning = updateTimer();
      if (!isRunning) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, onExpire]);

  if (!timeLeft) return null;

  const { days, hours, minutes, seconds, totalMs } = timeLeft;
  const isExpired = totalMs <= 0;

  if (isExpired && !showExpired) return null;

  let badgeColor = "bg-secondary/40 text-muted-foreground border-border/50";
  let icon = <Clock className="w-3.5 h-3.5" />;
  let label = "";

  if (isExpired) {
    badgeColor = "bg-red-500/10 text-red-400/80 border-red-500/20";
    label = "리뷰 기간 만료";
  } else if (totalMs < 1000 * 60 * 60) {
    // Less than 1 hour (pulsing red warning)
    badgeColor = "bg-destructive/15 text-destructive border-destructive/30 animate-pulse";
    icon = <Timer className="w-3.5 h-3.5 animate-spin-slow" />;
    label = `마감 임박 (${minutes}분 ${seconds}초)`;
  } else if (totalMs < 1000 * 60 * 60 * 24) {
    // Less than 24 hours (amber warn)
    badgeColor = "bg-amber-500/10 text-amber-500 border-amber-500/20";
    icon = <AlertTriangle className="w-3.5 h-3.5" />;
    label = `오늘 마감 (${hours}시간 ${minutes}분)`;
  } else {
    // More than 24 hours (healthy green)
    badgeColor = "bg-pitch/10 text-pitch border-pitch/20";
    label = `${days}일 ${hours}시간 남음`;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-display font-medium backdrop-blur-sm shadow-sm",
        badgeColor,
        className
      )}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};
