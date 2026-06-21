import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { getTeams } from "@/lib/api/matches";
import { teams as mockTeams } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Heart, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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

const Profile = () => {
  const navigate = useNavigate();
  const { isLoggedIn, nickname, myTeamId, updateFavoriteTeam } = useAuth();
  const [teamsList, setTeamsList] = useState<{ id: number; teamName: string }[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [isChangingTeam, setIsChangingTeam] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    setLoadingTeams(true);
    getTeams()
      .then((res) => {
        setTeamsList(res.teamResponses);
      })
      .catch((err) => {
        console.error("Failed to load teams list", err);
      })
      .finally(() => {
        setLoadingTeams(false);
      });
  }, [isLoggedIn]);

  // Find the selected team details from mockData teams list
  const currentFavoriteTeam = mockTeams.find((t) => t.id === myTeamId);

  const handleSelectTeam = (teamName: string) => {
    const mockId = TEAM_ID_MAP[teamName.toLowerCase()];
    updateFavoriteTeam(mockId || null);
    setIsChangingTeam(false);
  };

  const handleClearTeam = () => {
    updateFavoriteTeam(null);
    setIsChangingTeam(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container max-w-5xl mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-12 h-12 text-pitch mb-4 animate-bounce" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">로그인이 필요합니다</h1>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">마이페이지를 확인하려면 먼저 로그인해 주세요.</p>
          <Button onClick={() => navigate("/login")} className="cursor-pointer">로그인하러 가기</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            뒤로 가기
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="md:col-span-1 rounded-lg border border-border bg-card p-6 flex flex-col items-center text-center h-fit">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pitch to-pitch-dim flex items-center justify-center font-display text-2xl font-bold text-primary-foreground mb-4 shadow-lg shadow-pitch/10">
              {nickname[0]?.toUpperCase()}
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-1">{nickname}</h2>
            <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-pitch bg-pitch/10 px-2.5 py-0.5 rounded-full mb-6">
              K리그 서포터즈
            </span>
            <div className="w-full border-t border-border/60 pt-4 text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">가입 구분</span>
                <span className="text-foreground font-medium flex items-center gap-1 flex-row">
                  <Sparkles className="w-3 h-3 text-pitch shrink-0" />
                  간편 소셜 로그인
                </span>
              </div>
            </div>
          </div>

          {/* Favorite Team Management */}
          <div className="md:col-span-2 rounded-lg border border-border bg-card p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-pitch fill-pitch" />
              <h3 className="font-display font-semibold text-foreground text-sm">마이 팀 관리</h3>
            </div>

            {(!currentFavoriteTeam || isChangingTeam) ? (
              // Case: No team selected or choosing/changing team
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground text-sm mb-1">응원하는 K리그 팀을 선택하세요</h4>
                  <p className="text-xs text-muted-foreground">마이 팀을 설정하면 홈 화면에서 해당 팀의 경기 정보를 우선적으로 확인할 수 있습니다.</p>
                </div>

                {loadingTeams ? (
                  <div className="flex items-center justify-center py-20 flex-1">
                    <Loader2 className="w-6 h-6 text-pitch animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1 mb-6 border border-border/40 p-2.5 rounded-lg bg-secondary/10 flex-1">
                    {teamsList.map((t) => {
                      const info = TEAM_DISPLAY_MAP[t.teamName.toLowerCase()] || {
                        name: t.teamName,
                        logo: "⚽",
                      };
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleSelectTeam(t.teamName)}
                          className="flex flex-col items-center justify-center p-3 rounded-lg border border-border/60 bg-card text-muted-foreground hover:border-primary/45 hover:bg-secondary/40 hover:text-foreground transition-all cursor-pointer duration-200"
                        >
                          <span className="text-2xl mb-1">{info.logo}</span>
                          <span className="text-[11px] font-medium truncate w-full">{info.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {isChangingTeam && (
                  <Button
                    variant="ghost"
                    onClick={() => setIsChangingTeam(false)}
                    className="w-full text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    변경 취소
                  </Button>
                )}
              </div>
            ) : (
              // Case: Has favorite team
              <div className="flex-1 flex flex-col justify-between py-4">
                <div className="flex items-center gap-6 border border-border bg-gradient-to-br from-card to-pitch-dim/5 p-6 rounded-lg mb-6">
                  <div className="w-16 h-16 rounded-full bg-secondary/80 flex items-center justify-center text-4xl shadow-inner shadow-black/10 shrink-0">
                    {currentFavoriteTeam.logo}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-pitch bg-pitch/10 px-2 py-0.5 rounded">
                        MY TEAM
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-xl text-foreground truncate">
                      {currentFavoriteTeam.name}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      홈구장: {currentFavoriteTeam.stadium}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs cursor-pointer h-10"
                    onClick={() => setIsChangingTeam(true)}
                  >
                    응원 팀 변경
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-xs text-destructive hover:bg-destructive/10 cursor-pointer h-10 border border-destructive/20 hover:border-destructive/30"
                    onClick={handleClearTeam}
                  >
                    응원 팀 해제
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
