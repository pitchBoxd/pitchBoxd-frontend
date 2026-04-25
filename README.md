# PitchBoxd ⚽

K리그 경기 리뷰 및 선수 평점 플랫폼. 경기를 관람한 팬들이 선수에게 평점을 매기고 한줄평을 남기는 서비스입니다.

> **Draft 상태**: 현재 모든 데이터는 하드코딩된 목업 데이터를 사용합니다. 실제 API 연동, 평점 제출, 리뷰 저장 등의 기능은 아직 구현되지 않았습니다. UI와 라우팅 구조만 완성된 상태입니다.

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | React Router v7 (SSR) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS + shadcn/ui |
| 빌드 | Vite |
| 패키지 매니저 | Bun (또는 npm) |
| 테스트 | Vitest + Playwright |

---

## 시작하기

### 요구 사항

- [Node.js](https://nodejs.org/) 18 이상
- [Bun](https://bun.sh/) (권장) 또는 npm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/pitchBoxd/pitchBoxd-frontend.git
cd k-league-beats

# 의존성 설치
bun install
# 또는
npm install

# 개발 서버 실행 (http://localhost:5173)
bun run dev
# 또는
npm run dev
```

### 기타 명령어

```bash
# 프로덕션 빌드
bun run build

# 빌드 후 프로덕션 서버 실행
bun run start

# 빌드 후 로컬 프리뷰
bun run preview

# 린트
bun run lint

# 단위 테스트 (단발 실행)
bun run test

# 단위 테스트 (watch 모드)
bun run test:watch
```

---

## 페이지 구조

| 경로 | 설명 |
|------|------|
| `/` | 홈 — 최신 라운드 경기 목록 + 핫 리뷰 |
| `/rounds` | 라운드별 경기 목록 |
| `/match/:id` | 경기 상세 — 선수 평점, 리뷰 |
| `/teams` | K리그1 팀 목록 |
| `/teams/:id` | 팀 상세 |
| `/players` | 선수 목록 (평점 순 정렬) |
| `/players/:id` | 선수 상세 — 경기별 평점, 한줄평 |

---

## 프로젝트 구조

```
k-league-beats/
├── app/
│   ├── components/      # 공통 UI 컴포넌트
│   ├── contexts/        # AuthContext (데모 인증)
│   ├── data/
│   │   └── mockData.ts  # 모든 목업 데이터
│   ├── routes/          # 페이지 컴포넌트 (React Router v7)
│   ├── root.tsx         # 전역 레이아웃 및 Provider
│   └── routes.ts        # 라우트 선언
├── src/                 # 레거시 코드 (참고용, 비활성)
└── public/              # 정적 파일
```

> `app/`이 실제 활성화된 코드입니다. `src/`는 Lovable 이식 과정에서 남겨진 레거시 코드로 라우터에 연결되지 않습니다.

---

## 데모 인증

실제 회원가입/로그인 없이 헤더의 **"로그인"** 버튼을 클릭하면 즉시 데모 계정으로 로그인됩니다.
로그인 시 홈 화면에 **"우리 팀 경기"** 섹션(FC서울)이 표시됩니다.

---

## 미구현 기능

UI는 존재하나 아직 실제로 동작하지 않는 기능들입니다.

- 경기 평점 제출 및 선수 개별 평점 입력
- 리뷰/한줄평 작성 및 저장
- 좋아요(likes) 버튼
- 실제 사용자 계정 (회원가입, 진짜 로그인)
- API 연동 (TanStack Query 준비만 되어 있음)

