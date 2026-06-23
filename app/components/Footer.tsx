import { Link } from "react-router";

/**
 * 프리미엄 느낌의 Footer 컴포넌트.
 * - 다크 모드 배경 + 보라‑핑크 포인트 로고
 * - 주요 페이지 링크 (홈, 경기, 팀, 선수, 소개)
 * - 저작권·법적 정보
 * - 반응형 레이아웃 (mobile: column, md+: row)
 */
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-800 bg-neutral-950 py-6 text-neutral-400">
      <div className="container mx-auto flex flex-col items-center gap-4 md:flex-row md:justify-between px-4 max-w-5xl">
        {/* 브랜드 */}
        <div className="flex items-center gap-3">
          {/* 로고 자리 */}
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500" />
          <span className="text-lg font-semibold text-neutral-100">PitchBoxd</span>
        </div>

        {/* 주요 네비게이션 */}
        <nav className="flex flex-wrap gap-4 text-sm">
          <Link to="/" className="hover:text-neutral-200 transition-colors">
            홈
          </Link>
          <Link to="/rounds" className="hover:text-neutral-200 transition-colors">
            경기
          </Link>
          <Link to="/teams" className="hover:text-neutral-200 transition-colors">
            팀
          </Link>
          <Link to="/about" className="hover:text-neutral-200 transition-colors">
            소개
          </Link>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfCAT4GdZ6dA-j2bWK5XKuJvbcLFvwUIa7HHL2pq0PITsjQvA/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-200 transition-colors cursor-pointer"
          >
            피드백
          </a>
        </nav>

        {/* 법적·저작권 정보 */}
        <div className="text-xs text-neutral-600">
          © {new Date().getFullYear()} PitchBoxd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

