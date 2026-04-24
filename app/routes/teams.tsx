import { useNavigate } from "react-router";
import { Header } from "@/components/Header";
import { teams } from "@/data/mockData";
import { ChevronRight } from "lucide-react";

const Teams = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">
          K리그 1 팀
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => navigate(`/teams/${team.id}`)}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:bg-secondary/50 transition-all text-left group"
            >
              <span className="text-2xl">{team.logo}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-foreground text-sm">
                  {team.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  📍 {team.stadium}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Teams;
