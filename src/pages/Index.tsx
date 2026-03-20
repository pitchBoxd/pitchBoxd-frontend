import { useNavigate } from "react-router-dom";
import { matches } from "@/data/mockData";
import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import { TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const featured = matches.find((m) => m.isFeatured);
  const otherMatches = matches.filter((m) => !m.isFeatured);

  const handleMatchClick = (id: string) => {
    navigate(`/match/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-pitch" />
            <span className="text-xs uppercase tracking-[0.2em] font-display text-pitch">
              K리그 1 · 2026
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-2">
            경기를 기록하고,<br />
            <span className="text-pitch">선수를 평가하세요.</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md">
            팬들의 시선으로 완성하는 K리그 매치 리뷰 플랫폼
          </p>
        </div>

        {/* Featured Match */}
        {featured && (
          <div className="mb-8">
            <MatchCard match={featured} onClick={handleMatchClick} featured />
          </div>
        )}

        {/* Round Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-foreground text-sm">
            라운드 {matches[0]?.round} 전체 경기
          </h2>
          <span className="text-xs text-muted-foreground">
            {matches.length}경기
          </span>
        </div>

        {/* Match Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {otherMatches.map((match) => (
            <MatchCard key={match.id} match={match} onClick={handleMatchClick} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
