# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PitchBoxd** — K리그 경기 리뷰 및 선수 평점 플랫폼. Lovable(AI 코드 생성 도구)로 초안을 만든 뒤 React Router v7으로 이식한 프로젝트입니다.

> **Draft 상태**: 현재 모든 데이터는 `app/data/mockData.ts`의 하드코딩된 목업 데이터를 사용합니다. 실제 API 연동, 평점 제출, 리뷰 저장 등의 기능은 아직 구현되지 않았습니다. UI와 라우팅 구조만 완성된 상태입니다.

## Commands

```bash
# 개발 서버 실행
bun run dev          # 또는 npm run dev

# 빌드
bun run build

# 린트
bun run lint

# 테스트 (단발 실행)
bun run test

# 테스트 (watch 모드)
bun run test:watch

# 프로덕션 서버 시작 (빌드 후)
bun run start

# 빌드 후 로컬 프리뷰
bun run preview
```

## Architecture

### 디렉토리 구조 주의사항

프로젝트에 `app/`과 `src/` 두 디렉토리가 공존합니다.

- **`app/`** — 실제 활성화된 React Router v7 앱. 이곳을 수정하세요.
- **`src/`** — Lovable 이식 과정에서 남겨진 레거시 코드. 라우터에 연결되지 않으며, 참고용으로만 존재합니다.

### 라우팅

React Router v7 (SSR 활성화)을 사용합니다. 라우트는 `app/routes.ts`에 명시적으로 선언됩니다.

```
/               → app/routes/home.tsx       # 최신 라운드 경기 목록 + 핫 리뷰
/match/:id      → app/routes/match-detail.tsx  # 경기 상세, 선수 평점, 리뷰
/rounds         → app/routes/rounds.tsx     # 라운드별 경기 목록
/teams          → app/routes/teams.tsx      # 팀 목록
/teams/:id      → app/routes/team-detail.tsx
/players        → app/routes/players.tsx    # 선수 목록 (평점 순 정렬)
/players/:id    → app/routes/player-detail.tsx  # 선수 상세, 경기별 평점, 한줄평
```

### 데이터 레이어 (Mock)

`app/data/mockData.ts` 하나에 모든 목업 데이터가 집중되어 있습니다. 실제 API로 교체할 때의 참고 구조:

- `teams[]` — 12개 K리그1 팀
- `matches[]` — 라운드별 경기 (완료 경기는 `totalRatings > 0`, 예정 경기는 `totalRatings: 0`)
- `matchPlayers: Record<matchId, Player[]>` — 경기별 출전 선수 (현재 match-1만 데이터 있음)
- `allPlayers[]` — 리그 전체 선수 목록
- `playerMatchRatings: Record<playerId, [...]]` — 선수별 경기별 평점 이력
- `matchReviews: Record<matchId, Review[]>` — 경기별 한줄평
- `playerReviews: Record<playerId, PlayerReview[]>` — 선수별 한줄평

`home.tsx`의 `TODAY` 상수(`"2026-03-23"`)는 "오늘"을 시뮬레이션하기 위해 하드코딩되어 있습니다.

### 인증

`app/contexts/AuthContext.tsx`에 데모용 인증만 구현되어 있습니다.

- 실제 로그인/회원가입 없음
- 헤더의 "로그인" 버튼 클릭 시 하드코딩된 `DEMO_USER`로 즉시 로그인
- 로그인 상태는 `localStorage`의 `demo_logged_in` 키로 유지
- 로그인 시 홈 화면에 "우리 팀 경기" 섹션이 표시됨 (myTeamId: `"fcseoul"`)

### 전역 Provider 구조 (`app/root.tsx`)

```
QueryClientProvider (TanStack Query — 설정만 되어 있고 실제 쿼리 미사용)
  └── AuthProvider
        └── TooltipProvider
              └── Outlet (라우트 컴포넌트)
```

### UI / 스타일

- **컴포넌트**: shadcn/ui (Radix UI 기반). `components.json` 기준으로 `@/components/ui/` 경로.
- **폰트**: JetBrains Mono (`font-display`), Space Grotesk (`font-body`)
- **커스텀 색상**: `pitch` (초록), `rating` (별점 색), `surface-hover` — Tailwind config 및 CSS 변수로 정의
- **테마**: 다크 전용 (Tailwind `darkMode: ["class"]` 설정만 있고 `.dark` 셀렉터 미정의 — `:root`가 다크 팔레트)

## Design System

UI·시각 작업 전에 **반드시 `DESIGN.md`를 먼저 읽으세요.** 폰트, 컬러 토큰, 스페이싱, 컴포넌트 패턴, anti-pattern이 모두 정의되어 있습니다.

- 새 HEX 컬러 도입 금지 → 항상 `hsl(var(--*))` 토큰 사용
- 평점·스코어 등 숫자에는 항상 `font-display tabular-nums` 적용
- 본문에 `font-display`(JetBrains Mono) 사용 금지 — 모노는 디스플레이·숫자·라벨 전용
- 명시적 승인 없이 DESIGN.md에 정의된 시스템에서 벗어나지 말 것

### 경로 alias

`@/` → `app/` (또는 `src/` — vite.config.ts 확인 필요)

## 미구현 기능 (Draft)

다음 기능은 UI만 존재하고 실제 동작하지 않습니다:

- 경기 평점 제출 (`match-detail.tsx`의 StarRating + 리뷰 textarea + "평가 제출" 버튼)
- 선수 개별 평점 입력
- 리뷰/한줄평 작성 및 저장
- 좋아요(likes) 버튼
- 실제 사용자 계정 (회원가입, 진짜 로그인)
- API 연동 (TanStack Query 준비만 되어 있음)
