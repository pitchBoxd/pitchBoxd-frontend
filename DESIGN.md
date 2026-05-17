# Design System — PitchBoxd

> 이 문서는 현재 코드베이스(`app/index.css`, `tailwind.config.ts`, `app/components/`)에서 추출한 디자인 시스템입니다. UI 작업 전에 반드시 읽고, 변경 시 이 문서도 함께 업데이트하세요.

## Product Context

- **제품:** PitchBoxd — K리그 경기 리뷰 및 선수 평점 플랫폼 (Letterboxd의 축구 버전)
- **사용자:** K리그 팬, 데이터/통계에 진심인 관전자
- **카테고리:** 스포츠 데이터 / 팬 커뮤니티 / 평점 플랫폼
- **프로젝트 타입:** SSR 웹 앱 (React Router v7)
- **현재 상태:** Draft — UI/라우팅 완성, 데이터는 mockData, 평점·리뷰 제출 미구현

## Aesthetic Direction

- **방향:** Industrial / Stat-Tracker — 데이터 대시보드의 정밀함과 매거진의 타이포그래피 위계를 결합. 어두운 스튜디오에서 켜진 스코어보드 같은 느낌.
- **무드:** "데이터는 진지하게, UI는 가볍게." 화려하지 않지만 모든 숫자가 또렷하게 읽혀야 함.
- **장식 수준:** intentional — 그라데이션·글로우는 강조 카드에만, 일반 카드는 보더와 타이포로만 구분.
- **레퍼런스:** Letterboxd (영화 평점 UI 모델), FotMob / Sofascore (축구 데이터 표현), Linear (다크 모드 + 모노스페이스 라벨링).

## Typography

JetBrains Mono를 본문이 아니라 **디스플레이**로 쓰는 게 이 시스템의 시그니처. 일반적인 스포츠 UI가 sans-serif에 몰리는 것과 의도적으로 다름. 모노가 숫자(스코어, 평점, 라운드)의 신뢰감을 만든다.

| 역할 | 폰트 | 가중치 | 용도 |
|---|---|---|---|
| Display | **JetBrains Mono** | 400, 500, 600, 700 | `h1`~`h6`, 스코어, 평점 뱃지, 날짜·라운드, 섹션 라벨, 팀명 |
| Body | **Space Grotesk** | 400, 500, 600, 700 | 본문, 설명, 한줄평, 메타 정보 |

- **로딩:** Google Fonts CDN (`app/index.css` 상단 `@import`)
- **CSS 변수:** `--font-display`, `--font-body`
- **유틸리티 클래스:** `font-display`, `font-body`
- **자동 적용:** `body` → `font-body`, `h1`~`h6` → `font-display`

### Type Treatment 패턴

```
// 섹션 라벨 (반복 사용되는 시그니처 패턴)
className="text-xs uppercase tracking-[0.2em] font-display text-pitch"

// 페이지 히어로
className="font-display text-3xl sm:text-4xl font-bold leading-tight"

// 스코어 (큰 숫자)
className="text-2xl font-bold font-display"

// 평점 뱃지 — 항상 tabular-nums
className="font-display tabular-nums"
```

> **운영 메모:** Space Grotesk는 디자인 컨설팅 가이드의 "과잉 노출 폰트" 리스트에 있음. 현재는 차분한 보조 역할이라 문제 없지만, 향후 리브랜딩 시 Instrument Sans / DM Sans / Geist 등으로 교체를 검토할 여지 있음. 지금은 유지.

## Color

HSL 기반 토큰. 라이트 모드 변수가 정의되어 있지 않음 → **현재는 다크 모드 전용**. `darkMode: ["class"]` 설정만 있고 `.dark` 셀렉터가 비어 있는 상태.

### Brand Tokens

| 토큰 | HSL | 대략 HEX | 용도 |
|---|---|---|---|
| `--pitch-green` | `142 50% 55%` | `#5fc07a` | 브랜드 컬러. 잔디 그린. 로고·강조·CTA 보조. |
| `--pitch-green-dim` | `142 40% 25%` | `#266c3f` | 강조 카드 그라데이션의 어두운 끝. |
| `--rating-star` | `38 92% 50%` | `#f5a30a` | 평점 별. 메달 골드. |

### Semantic Tokens (`:root`)

| 토큰 | HSL | 역할 |
|---|---|---|
| `--background` | `220 20% 7%` | 페이지 베이스. 거의 검정에 가까운 차가운 네이비. |
| `--foreground` | `210 20% 92%` | 본문 텍스트. 순백 아님(약간의 따뜻함). |
| `--card` | `220 18% 10%` | 카드·헤더 표면. |
| `--popover` | `220 18% 10%` | 팝오버·드롭다운. |
| `--primary` | `142 50% 55%` | = pitch-green. 주요 액션. |
| `--primary-foreground` | `220 20% 7%` | 프라이머리 위 텍스트(검정). |
| `--secondary` | `220 16% 16%` | 토글·세컨더리 표면. |
| `--secondary-foreground` | `210 20% 82%` | 위 텍스트. |
| `--muted` | `220 14% 14%` | 비활성 표면. |
| `--muted-foreground` | `215 12% 50%` | 메타·캡션 텍스트. |
| `--accent` | `38 92% 50%` | = rating-star. 옐로우/앰버 강조. |
| `--accent-foreground` | `220 20% 7%` | 액센트 위 텍스트. |
| `--destructive` | `0 72% 51%` | 에러·삭제·로그아웃. |
| `--destructive-foreground` | `210 40% 98%` | 위 텍스트. |
| `--border` | `220 14% 18%` | 일반 보더. |
| `--input` | `220 14% 18%` | 인풋 보더. |
| `--ring` | `142 50% 55%` | 포커스 링(= pitch-green). |
| `--surface-hover` | `220 16% 20%` | 카드 호버 표면. |

### Sidebar Tokens

사이드바 전용 토큰 세트도 별도 정의되어 있음 (`--sidebar-*`). 현재 UI에서는 미사용으로 보이나 shadcn 사이드바 컴포넌트 도입 시 사용.

### 평점 컬러 매핑 (`RatingBadge`)

평점 → 색 매핑 규칙. 변경 시 다른 평점 표현에도 동일 적용.

| 평점 범위 | 컬러 |
|---|---|
| ≥ 4.0 | `bg-primary` (pitch-green) |
| 3.0 – 3.9 | `bg-accent` (amber) |
| 2.0 – 2.9 | `bg-muted` |
| < 2.0 | `bg-destructive` |

## Spacing

- **베이스:** 4px (Tailwind 기본 스케일)
- **밀도:** comfortable — 컴팩트하지도, 여백 과한 에디토리얼도 아님. 카드 내부 패딩 `p-5`(20px), 섹션 간 `mb-10`~`mb-12`(40~48px) 정도가 표준.
- **컨테이너:** `container` + `max-w-5xl mx-auto` (최대 1024px), 좌우 `px-4`.
- **헤더 높이:** `h-14` (56px).
- **수직 페이지 패딩:** `py-10` (40px).

## Layout

- **접근법:** grid-disciplined. `max-w-5xl` 중앙 정렬, 모바일 우선, `sm:grid-cols-2`로 2열 전환.
- **헤더:** 스티키 + `backdrop-blur-sm` + 반투명 카드(`bg-card/50`).
- **카드 그리드:** 1열 → `sm:grid-cols-2`, `gap-3` (12px).
- **반응형 브레이크포인트:** Tailwind 기본 (`sm:640`, `md:768`, `lg:1024`, `xl:1280`, `2xl:1400` 컨테이너 한정).

### Border Radius

| 토큰 | 값 | 용도 |
|---|---|---|
| `--radius` (lg) | `0.75rem` (12px) | 카드, 큰 표면 |
| md | `0.625rem` (10px) | 버튼, 평점 뱃지 |
| sm | `0.5rem` (8px) | 작은 컨트롤 |
| `rounded-full` | — | 아바타, 토글 |

## Motion

intentional — 기능적 인터랙션 + 한정된 강조 애니메이션만.

### 정의된 키프레임 (`tailwind.config.ts`)

| 이름 | 지속 | 용도 |
|---|---|---|
| `fade-in` | 0.4s ease-out forwards | 페이지·카드 진입 (8px 상승 + opacity) |
| `pulse-glow` | 2s ease-in-out infinite | 강조 요소의 pitch-green 박스섀도우 펄스 |
| `accordion-down` / `up` | 0.2s ease-out | Radix 아코디언 |

### 표준 트랜지션

```
transition-colors            // 200ms — 컬러 전환
transition-all duration-200  // 카드 호버 시 보더/배경/섀도우 동시 변화
```

### Hover 패턴 (카드)

```
hover:border-primary/40
hover:bg-surface-hover
hover:shadow-lg hover:shadow-primary/5
```

## Component Patterns

### Card (MatchCard 등 데이터 카드)

- 기본: `rounded-lg border border-border bg-card p-5`
- 호버: 보더가 `primary/40`으로, 배경이 `surface-hover`로, `shadow-primary/5` 추가
- 강조(`featured`): `border-primary/30 bg-gradient-to-br from-card to-pitch-dim/20`
- 그룹 호버용 자식 효과: `group` 클래스 + `group-hover:*`

### Section Label (반복 패턴)

```tsx
<div className="flex items-center gap-2 mb-3">
  <Icon className="w-4 h-4 text-pitch" />
  <span className="text-xs uppercase tracking-[0.2em] font-display text-pitch">
    섹션 제목
  </span>
</div>
```

### Toggle Group (라운드/주간 같은 segmented control)

```tsx
<div className="flex items-center rounded-lg border border-border bg-secondary p-0.5 text-xs">
  <button className={cn(
    "px-3 py-1.5 rounded-md transition-colors font-medium",
    active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
  )}>...</button>
</div>
```

### Button (shadcn variants)

- `default` — `bg-primary` (pitch-green)
- `destructive` — `bg-destructive`
- `outline` — `border border-input bg-background`
- `secondary` — `bg-secondary`
- `ghost` — 투명, 호버 시 `bg-accent`
- `link` — `text-primary` 밑줄

**사이즈:** `default` h-10, `sm` h-9, `lg` h-11, `icon` 10×10.

### Rating Badge

- 항상 `font-display tabular-nums`로 숫자 정렬
- 사이즈: `sm` (text-xs), `md` (text-sm semibold), `lg` (text-2xl bold)
- 평점 컬러 매핑은 위 [평점 컬러 매핑] 참조

## Iconography

- **라이브러리:** `lucide-react` 단일
- **표준 사이즈:** UI 내 `w-3 h-3` (12px), `w-4 h-4` (16px), 버튼 내장 `[&_svg]:size-4`
- **색상:** 강조는 `text-pitch`, 메타는 `text-muted-foreground`, 본문은 상속

## Accessibility & Quality Rules

- **포커스 링:** 모든 인터랙티브 요소에 `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- **숫자 정렬:** 평점·스코어 등 숫자 비교가 일어나는 곳은 반드시 `tabular-nums`
- **버튼 비활성:** `disabled:pointer-events-none disabled:opacity-50`
- **컬러 단독으로 의미 전달 금지:** 평점 컬러는 항상 숫자 라벨과 함께
- **대비:** `--foreground`/`--background` 페어는 충분한 대비 확보 (HSL L 7% vs 92%)

## Anti-Patterns (이 시스템에서는 하지 말 것)

- ❌ 본문에 `font-display`(JetBrains Mono) 사용 — 가독성 떨어짐. 모노는 디스플레이·숫자·라벨 전용.
- ❌ 새로운 hardcoded HEX 컬러 도입 — 항상 토큰(`hsl(var(--*))`) 사용.
- ❌ 라이트 모드 가정한 컬러 (`text-white`, `bg-black` 등) — 토큰만 사용.
- ❌ 보라/바이올렛 그라데이션 — 브랜드 무드와 충돌.
- ❌ 둥글기 일관성 깨기 — 카드는 `rounded-lg`, 버튼은 `rounded-md`, 풀라운드는 아바타·토글만.
- ❌ 평점 뱃지에서 `tabular-nums` 누락.

## Open Questions / Tech Debt

향후 결정해야 할 사항:

1. **라이트 모드 지원 여부.** `darkMode: ["class"]` 설정만 있고 `.dark` 셀렉터·라이트 팔레트 없음. 다크 전용으로 갈지, 라이트 추가할지 결정 필요.
2. **`app/App.css` 정리.** Vite 템플릿 잔재(`.logo`, `.read-the-docs`)가 남아있음. 미사용 시 삭제.
3. **사이드바 토큰 미사용.** `--sidebar-*` 토큰 정의만 있고 사용처 없음. 도입 계획 없으면 제거.
4. **`src/` vs `app/` 이중 구조.** Lovable 이식 잔재. `src/`는 라우터 비연결 — 추출 후 삭제 또는 정리 권장.
5. **폰트 호스팅.** 현재 Google Fonts CDN. 한국 사용자 기준 Bunny Fonts 또는 self-host 전환 시 LCP 개선 가능.

## Decisions Log

| 날짜 | 결정 | 근거 |
|---|---|---|
| 2026-05-18 | DESIGN.md 초기 작성 | 코드베이스(`tailwind.config.ts`, `app/index.css`, 컴포넌트)에서 추출. 새로 만든 것 없음. |
