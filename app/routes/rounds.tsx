import { useNavigate } from "react-router";
import { matches } from "@/data/mockData";
import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import { Calendar, Clock, Pin } from "lucide-react";
import { cn } from "@/lib/utils";

const TODAY = "2026-03-23";

const Rounds = () => {
  const navigate = useNavigate();

  // Group matches by round
  const roundMap = new Map<number, typeof matches>();
  matches.forEach((m) => {
    const list = roundMap.get(m.round) || [];
    list.push(m);
    roundMap.set(m.round, list);
  });

  // Sort rounds descending
  const sortedRounds = Array.from(roundMap.entries()).sort(
    ([a], [b]) => b - a
  );

  // Find latest completed round (has at least one match with date <= today)
  const latestCompletedRound = sortedRounds.find(([, roundMatches]) =>
    roundMatches.some((m) => m.date <= TODAY)
  )?.[0];

  const isMatchCompleted = (date: string) => date <= TODAY;
  const isRoundCompleted = (roundMatches: typeof matches) =>
    roundMatches.every((m) => isMatchCompleted(m.date));
  const isRoundUpcoming = (roundMatches: typeof matches) =>
    roundMatches.every((m) => !isMatchCompleted(m.date));

  const handleMatchClick = (id: string) => {
    navigate(`/match/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-pitch" />
            <span className="text-xs uppercase tracking-[0.2em] font-display text-pitch">
              K리그 1 · 2026
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            라운드별 경기
          </h1>
        </div>

        <div className="space-y-8">
          {sortedRounds.map(([round, roundMatches]) => {
            const isPinned = round === latestCompletedRound;
            const upcoming = isRoundUpcoming(roundMatches);

            return (
              <section
                key={round}
                className={cn(
                  "rounded-lg border border-border p-5",
                  isPinned && "border-pitch/40 bg-pitch-dim/10"
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  {isPinned && <Pin className="w-4 h-4 text-pitch" />}
                  <h2 className="font-display font-semibold text-foreground">
                    라운드 {round}
                  </h2>
                  {isPinned && (
                    <span className="text-[10px] uppercase tracking-widest font-display text-pitch bg-pitch/10 px-2 py-0.5 rounded">
                      최근 라운드
                    </span>
                  )}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {roundMatches.length}경기
                  </span>
                </div>

                {upcoming ? (
                  <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <p className="text-sm font-display">
                      아직 진행되지 않은 라운드입니다. 경기 종료 후 평가할 수
                      있어요.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {roundMatches.map((match) =>
                      isMatchCompleted(match.date) ? (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onClick={handleMatchClick}
                        />
                      ) : (
                        <div
                          key={match.id}
                          className="rounded-lg border border-border bg-card/50 p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground"
                        >
                          <Clock className="w-4 h-4" />
                          <p className="text-xs font-display">
                            {match.homeTeam} vs {match.awayTeam}
                          </p>
                          <p className="text-[10px]">
                            {match.date} · 경기 예정
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Rounds;
