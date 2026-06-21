import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Tv, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { oauthSignup } from "@/lib/api/auth";
import { getTeams } from "@/lib/api/matches";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const NICKNAME_MAX = 20;
const NICKNAME_RE = /^[\w가-힣ㄱ-ㅎㅏ-ㅣ_-]{2,20}$/;

const TEAM_DISPLAY_MAP: Record<string, { name: string; logo: string }> = {
  seoul: { name: "FC 서울", logo: "🔴" },
  suwon: { name: "수원 삼성", logo: "🔵" },
  jeonbuk: { name: "전북 현대", logo: "🟢" },
  ulsan: { name: "울산 HD", logo: "🟠" },
  daegu: { name: "대구 FC", logo: "🩵" },
  incheon: { name: "인천 유나이티드", logo: "🔷" },
  pohang: { name: "포항 스틸러스", logo: "🔴" },
  jeju: { name: "제주 유나이티드", logo: "🟠" },
  gangwon: { name: "강원 FC", logo: "🟤" },
  kimcheon: { name: "김천 상무", logo: "⚪" },
  gwangju: { name: "광주 FC", logo: "🟡" },
  suwonfc: { name: "수원 FC", logo: "🔵" },
  daejeon: { name: "대전 하나시티즌", logo: "🟢" },
  bucheon: { name: "부천 FC 1995", logo: "🔴" },
  anyang: { name: "FC 안양", logo: "🟣" },
  seoul_eland: { name: "서울 이랜드 FC", logo: "🔵" },
  seongnam: { name: "성남 FC", logo: "⚫" },
  jeonnam: { name: "전남 드래곤즈", logo: "🟡" },
  kimpo: { name: "김포 FC", logo: "🟢" },
  busan: { name: "부산 아이파크", logo: "🔴" },
  chungnam_asan: { name: "충남 아산 FC", logo: "🔵" },
  hwasung: { name: "화성 FC", logo: "🟠" },
  gyeongnam: { name: "경남 FC", logo: "🔴" },
  chungbuk_cheongju: { name: "충북 청주 FC", logo: "🔵" },
  cheonan: { name: "천안 시티 FC", logo: "🔵" },
  ansan: { name: "안산 그리너스 FC", logo: "🟢" },
  kimhae: { name: "김해시청 축구단", logo: "🟢" },
  yongin: { name: "용인시 시민축구단", logo: "🟢" },
  paju: { name: "파주시민축구단", logo: "🔵" },
};

const TEAM_ID_MAP: Record<string, string> = {
  seoul: "fcseoul",
  suwon: "suwon",
  jeonbuk: "jeonbuk",
  ulsan: "ulsan",
  daegu: "daegu",
  incheon: "incheon",
  pohang: "pohang",
  jeju: "jeju",
  gangwon: "gangwon",
  kimcheon: "gimcheon",
  gwangju: "gwangju",
  suwonfc: "suwonfc",
};

function decodeSignupTokenEmail(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return typeof decoded.email === "string" ? decoded.email : null;
  } catch {
    return null;
  }
}

function getSignupTokenFromCookie(): string | null {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("signupToken="))
      ?.split("=")[1] ?? null
  );
}

function deleteSignupTokenCookie() {
  document.cookie = "signupToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

const Signup = () => {
  const navigate = useNavigate();
  const { loginWithUser } = useAuth();
  const [signupToken, setSignupToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [step, setStep] = useState<"nickname" | "team">("nickname");
  
  const [teamsList, setTeamsList] = useState<{ id: number; teamName: string }[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [loadingTeams, setLoadingTeams] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = getSignupTokenFromCookie();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    setSignupToken(token);
    setEmail(decodeSignupTokenEmail(token));

    setLoadingTeams(true);
    getTeams()
      .then((res) => {
        setTeamsList(res.teamResponses);
      })
      .catch((err) => {
        console.error("Failed to load teams", err);
      })
      .finally(() => {
        setLoadingTeams(false);
      });
  }, [navigate]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!NICKNAME_RE.test(trimmed)) {
      setError(
        "닉네임은 2–20자, 한글/영문/숫자/_/- 만 사용할 수 있어요.",
      );
      return;
    }
    setError(null);
    setStep("team");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupToken) return;

    const trimmed = nickname.trim();
    setError(null);
    setSubmitting(true);
    try {
      const user = await oauthSignup({
        signupToken,
        nickname: trimmed,
        favoriteTeamId: selectedTeamId ?? undefined,
      });

      deleteSignupTokenCookie();

      // Find selected team mapping for client state myTeamId
      let myTeamId: string | undefined = undefined;
      if (selectedTeamId) {
        const selectedTeam = teamsList.find((t) => t.id === selectedTeamId);
        if (selectedTeam) {
          myTeamId = TEAM_ID_MAP[selectedTeam.teamName.toLowerCase()];
        }
      }

      loginWithUser({ id: user.id, nickname: trimmed, myTeamId });
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

  if (!signupToken) {
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

          {step === "nickname" ? (
            <>
              <h1 className="font-display text-3xl font-bold text-foreground leading-tight mb-3">
                마지막 한 단계,
                <br />
                <span className="text-pitch">닉네임을 정해주세요.</span>
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                평점과 한줄평에 표시될 이름이에요. 가입 후에도 변경할 수 있습니다.
              </p>

              {email && (
                <div className="flex items-center gap-3 mb-6 rounded-md border border-border bg-secondary/40 p-3">
                  <div className="w-9 h-9 rounded-full bg-pitch flex items-center justify-center font-display text-sm font-bold text-primary-foreground shrink-0">
                    {email[0].toUpperCase()}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{email}</p>
                </div>
              )}

              <form onSubmit={handleNextStep} className="space-y-4">
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
                  className="w-full h-11 cursor-pointer"
                >
                  다음 단계로
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold text-foreground leading-tight mb-3">
                응원하는 팀을
                <br />
                <span className="text-pitch">선택해 주세요.</span>
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                언제든지 변경할 수 있으며, 선택하지 않고 시작할 수 있습니다.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {loadingTeams ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-pitch animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1 mb-6 border border-border/40 p-2.5 rounded-lg bg-secondary/10">
                    {teamsList.map((t) => {
                      const isSelected = selectedTeamId === t.id;
                      const info = TEAM_DISPLAY_MAP[t.teamName.toLowerCase()] || {
                        name: t.teamName,
                        logo: "⚽",
                      };
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTeamId(isSelected ? null : t.id)}
                          className={cn(
                            "flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all cursor-pointer duration-200",
                            isSelected
                              ? "border-pitch bg-pitch/15 text-pitch font-semibold shadow-sm"
                              : "border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary/40 hover:text-foreground"
                          )}
                        >
                          <span className="text-2xl mb-1">{info.logo}</span>
                          <span className="text-[11px] truncate w-full">{info.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

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
                  className="w-full h-11 cursor-pointer"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : selectedTeamId ? (
                    "선택하고 시작하기"
                  ) : (
                    "선택하지 않고 시작하기"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep("nickname")}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors pt-2 cursor-pointer"
                  disabled={submitting}
                >
                  이전 단계로 돌아가기
                </button>
              </form>
            </>
          )}

          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="mt-6 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            disabled={submitting}
          >
            다른 Google 계정으로 다시 시도
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
