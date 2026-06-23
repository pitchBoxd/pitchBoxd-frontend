import { Header } from "@/components/Header";
import { Link } from "react-router";
import { Tv, Heart, Users, Star, ArrowRight, MessageSquare, ShieldCheck, Check } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-body selection:bg-pitch/30 selection:text-white">
      <Header />

      <main className="container max-w-4xl mx-auto px-6 py-16 flex-1 flex flex-col gap-24">
        {/* 히어로 섹션 */}
        <section className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pitch/20 bg-pitch/5 text-pitch text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-pitch animate-pulse" />
            <span>K-League Match Diary & Community</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-tight">
            경기를 관람하고,<br />
            당신의 <span className="text-pitch underline decoration-pitch/40 underline-offset-8">평점 일지</span>를 기록하세요.
          </h1>
          
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            PitchBoxd는 K리그 팬들을 위한 매치 아카이브이자 평점 플랫폼입니다. 
            당신이 마주한 90분의 드라마를 평점과 한줄평으로 남기고, 팬들의 집단지성으로 쌓여가는 K리그 진짜 통계를 만들어갑니다.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-pitch text-primary-foreground font-semibold hover:bg-pitch/90 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <span>경기 둘러보기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 비주얼 매치 다이어리 쇼케이스 (Letterboxd 느낌의 목업) */}
        <section className="relative rounded-2xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pitch/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col gap-6 relative">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">최근 활성화된 팬들의 다이어리</span>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
            </div>

            {/* 목업 경기 다이어리 아이템 */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-secondary/20 hover:bg-secondary/35 p-5 rounded-xl border border-border/40 transition-colors duration-200">
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-2xl">🔴</span>
                <div className="text-left">
                  <h4 className="font-semibold text-foreground text-sm">FC 서울</h4>
                  <p className="text-xs text-muted-foreground">홈팀</p>
                </div>
                <span className="mx-2 font-display text-lg font-bold text-foreground">3 - 1</span>
                <span className="text-2xl">🔵</span>
                <div className="text-left">
                  <h4 className="font-semibold text-foreground text-sm">수원 삼성</h4>
                  <p className="text-xs text-muted-foreground">원정팀</p>
                </div>
              </div>

              <div className="h-px w-full md:h-8 md:w-px bg-border/60 shrink-0" />

              <div className="flex-1 space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <div className="flex text-pitch">
                    {[1, 2, 3, 4].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-pitch text-pitch" />
                    ))}
                    <Star className="w-4 h-4 text-pitch" />
                  </div>
                  <span className="text-xs text-muted-foreground">by 수호신_상암</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed font-light">
                  "상암벌을 뜨겁게 달군 슈퍼매치. 기성용의 조율은 여전히 클래스가 달랐고, 린가드의 첫 골까지 터지며 완벽한 축제를 완성했다. 전술 변화와 교체 타이밍 모두 만점짜리 경기."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 세 가지 핵심 사용자 경험 (AI 느낌을 뺀 구체적인 기능 구현 형태 설명) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. 평점 기록 */}
          <div className="flex flex-col gap-4 text-left p-2">
            <div className="w-10 h-10 rounded-lg bg-pitch/10 text-pitch flex items-center justify-center">
              <Star className="w-5 h-5 fill-pitch/10" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">1. 세밀한 선수 평가</h3>
            <p className="text-muted-foreground text-sm leading-relaxed font-light">
              단순한 승패 기록을 넘어 선발 스쿼드와 교체 투입된 모든 선수의 활약상에 0.5점 단위로 평점을 매길 수 있습니다. 당신의 직관적인 평가가 데이터로 축적됩니다.
            </p>
            {/* 평점 위젯 목업 */}
            <div className="mt-2 p-3 bg-secondary/15 rounded-lg border border-border/40 flex justify-between items-center text-xs">
              <span className="text-muted-foreground">내 평점</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className="w-5 h-5 rounded bg-pitch text-primary-foreground flex items-center justify-center font-bold font-display cursor-pointer hover:scale-105 transition-transform">★</span>
                ))}
                <span className="w-5 h-5 rounded bg-secondary/40 text-muted-foreground flex items-center justify-center font-bold font-display cursor-pointer hover:scale-105 transition-transform">☆</span>
              </div>
            </div>
          </div>

          {/* 2. 감상 기록 */}
          <div className="flex flex-col gap-4 text-left p-2">
            <div className="w-10 h-10 rounded-lg bg-pitch/10 text-pitch flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">2. 매치 리뷰 다이어리</h3>
            <p className="text-muted-foreground text-sm leading-relaxed font-light">
              90분의 전술적 흐름, 아쉬웠던 판정, 현장의 뜨거웠던 열기를 기록하세요. 짧은 한줄평부터 디테일한 장문의 전술 분석 리뷰까지 자유롭게 기록하고 소통합니다.
            </p>
            {/* 리뷰 쓰기 목업 */}
            <div className="mt-2 p-3 bg-secondary/15 rounded-lg border border-border/40 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                <span>한줄평 남기기</span>
                <span className="text-pitch">작성 완료</span>
              </div>
              <div className="w-full h-8 bg-background border border-border rounded px-2 py-1 text-[11px] text-muted-foreground flex items-center">
                오늘 교체 카드 전술 타이밍이 예술...
              </div>
            </div>
          </div>

          {/* 3. 집단지성 데이터 */}
          <div className="flex flex-col gap-4 text-left p-2">
            <div className="w-10 h-10 rounded-lg bg-pitch/10 text-pitch flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">3. 팬들이 만드는 스탯</h3>
            <p className="text-muted-foreground text-sm leading-relaxed font-light">
              공식 공격 포인트가 전부가 아닙니다. 경기장에 직접 간 팬들이 기록한 평점들이 모여, 매주 라운드별 최고의 활약을 한 진짜 영웅들을 조명하는 통계가 완성됩니다.
            </p>
            {/* 랭킹 리스트 목업 */}
            <div className="mt-2 p-3 bg-secondary/15 rounded-lg border border-border/40 space-y-2 text-xs">
              <div className="flex justify-between text-[10px] text-muted-foreground pb-1 border-b border-border/40">
                <span>실시간 평점 랭킹</span>
                <span>평균 평점</span>
              </div>
              <div className="flex justify-between font-light">
                <span>1. 기성용 (FC 서울)</span>
                <span className="text-pitch font-semibold font-display">4.21 ★</span>
              </div>
              <div className="flex justify-between font-light">
                <span>2. 주민규 (울산 HD)</span>
                <span className="text-pitch font-semibold font-display">4.08 ★</span>
              </div>
            </div>
          </div>
        </section>

        {/* 기획 및 개발 배경 의도 (Manifesto) */}
        <section className="rounded-2xl border border-border bg-gradient-to-br from-secondary/10 to-card p-8 space-y-6 text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-pitch" />
            <h2 className="text-xl font-bold text-foreground">프로젝트 기획 의도</h2>
          </div>
          
          <div className="space-y-4 text-muted-foreground text-sm leading-relaxed font-light">
            <p>
              축구를 가장 깊게 즐기는 방법은 **"경기 종료 후 팬들의 수다와 피드백"**입니다. 
              하지만 많은 커뮤니티는 감정적인 비난이나 휘발성 글들로 가득 차, 특정 경기에 대한 순수한 팬들의 평가를 다시 모아보기 어렵습니다.
            </p>
            <p>
              PitchBoxd는 영화 평가 서비스 **Letterboxd**의 철학에서 영감을 받아 탄생했습니다. 
              경기를 하나의 작품처럼 여기고, 선수 개개인의 퍼포먼스를 아카이빙할 수 있도록 구성했습니다.
            </p>
            <p>
              기사나 공식 기록지에는 담기지 않는 **'오직 팬들만이 기록할 수 있는 헌신과 열정의 수치'**를 이곳에서 함께 남겨주세요.
            </p>
          </div>

          <div className="pt-2 border-t border-border/60 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground font-light">
            <div className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-pitch" />
              <span>자유로운 평점 부여</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-pitch" />
              <span>K리그 1 라운드별 매치 완벽 매핑</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-pitch" />
              <span>팬들의 생생한 집단지성 리뷰</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
