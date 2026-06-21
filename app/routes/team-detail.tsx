import { useNavigate } from "react-router";
import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";

const TeamDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/teams")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          전체 팀
        </button>
      </main>
    </div>
  );
};

export default TeamDetail;
