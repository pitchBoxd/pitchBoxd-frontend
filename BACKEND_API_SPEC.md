# PitchBoxd 백엔드 API 명세 (프론트엔드 기준)

> 프론트엔드 코드 기준으로 백엔드에 필요한 변경사항과 API 동작을 정리한 문서입니다.

---

## 인증 방식

모든 토큰은 **HttpOnly 쿠키**로 전달합니다. 프론트엔드는 `Authorization` 헤더를 사용하지 않으며, 모든 요청에 `credentials: "include"`를 설정합니다.

| 쿠키 | 용도 | 설정 |
|------|------|------|
| `accessToken` | API 인증 | HttpOnly, Secure(prod), SameSite=Lax, Path=/ |
| `refreshToken` | 토큰 재발급 | HttpOnly, Secure(prod), SameSite=Lax, Path=/ |

---

## 인프라 변경사항

### 1. `JwtAuthenticationFilter` — 쿠키에서 토큰 읽기 추가

현재 `Authorization: Bearer` 헤더만 읽도록 되어 있습니다. 쿠키도 읽도록 수정이 필요합니다.

```java
private String resolveToken(HttpServletRequest request) {
    // 기존: Authorization 헤더
    String bearerToken = request.getHeader("Authorization");
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
        return bearerToken.substring(7);
    }
    // 추가: accessToken 쿠키
    if (request.getCookies() != null) {
        for (Cookie cookie : request.getCookies()) {
            if ("accessToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
    }
    return null;
}
```

### 2. `SecurityConfig` — permitAll 목록 수정

```java
// 제거 (삭제된 엔드포인트)
"/api/v1/auth/google/signup"

// 추가
"/api/v1/auth/oauth/signup"
```

---

## OAuth 리다이렉트 동작

### `OAuth2AuthenticationSuccessHandler`

**기존 회원 로그인 성공 시**

```
현재: successRedirectUrl?accessToken=eyJ...
변경: accessToken을 HttpOnly 쿠키로 설정
      successRedirectUrl?userId={userId}
```

**신규 회원 (미가입) 시** — 현재 구현 그대로 유지

```
signupRedirectUrl?signupToken={signupToken}
```

### 개발 환경 redirect URL 설정

```yaml
# application-local.yaml
spring:
  security:
    oauth2:
      success-redirect-url: http://localhost:3000/login/callback
      signup-redirect-url: http://localhost:3000/signup
```

---

## 변경이 필요한 엔드포인트

### `POST /api/v1/auth/oauth/signup`

소셜 회원가입. signupToken을 검증하고 계정을 생성합니다.

**Request Body**
```json
{
  "signupToken": "eyJ...",
  "nickname": "준호",
  "favoriteTeamId": 1
}
```

**Response Body** ← 변경 필요 (`TokenResponse` → `UserResponse`)
```json
{
  "id": 123,
  "nickname": "준호"
}
```

**Response Cookie** ← 변경 필요 (쿠키로 발급)
```
Set-Cookie: accessToken=eyJ...; HttpOnly; Secure; SameSite=Lax; Path=/
Set-Cookie: refreshToken=eyJ...; HttpOnly; Secure; SameSite=Lax; Path=/
```

---

### `POST /api/v1/auth/reissue`

refreshToken 쿠키를 이용해 토큰을 재발급합니다. 앱 시작 시 프론트엔드가 호출해 로그인 상태를 복원합니다.

**Request Cookie**
```
Cookie: refreshToken=eyJ...
```

**Response Body** ← 변경 필요 (`TokenResponse` → `UserResponse`)
```json
{
  "id": 123,
  "nickname": "준호"
}
```

**Response Cookie** ← 변경 필요 (accessToken도 쿠키로 발급)
```
Set-Cookie: accessToken=eyJ...; HttpOnly; Secure; SameSite=Lax; Path=/
Set-Cookie: refreshToken=eyJ...; HttpOnly; Secure; SameSite=Lax; Path=/
```

---

## 변경 없는 엔드포인트

### `GET /api/v1/users/me`

로그인한 사용자의 정보를 반환합니다.

**Auth**: accessToken 쿠키 (자동 첨부)

**Response Body**
```json
{
  "id": 123,
  "nickname": "준호"
}
```

---

### `POST /api/v1/auth/logout`

로그아웃. refreshToken 쿠키를 만료시킵니다.

**Response**: `200 OK` (body 없음)

---

### `GET /api/v1/users/exists?email={email}`

이메일 중복 확인.

**Response Body**
```json
{
  "isDuplicated": false
}
```

---

### `GET /api/v1/match-reviews/hot?size={size}`

핫 리뷰 목록.

**Response Body**
```json
{
  "responses": [
    {
      "id": 1,
      "matchId": 1,
      "homeTeamName": "FC서울",
      "awayTeamName": "전북",
      "authorNickname": "준호",
      "userId": 123,
      "content": "명경기였습니다.",
      "likeCount": 42,
      "rating": 4.5
    }
  ]
}
```

---

### `GET /api/v1/matches/reviewable?userId={userId}&filter={filter}`

평가 가능한 경기 목록.

**Response Body**
```json
{
  "matchResponses": [
    {
      "id": 1,
      "round": "1R",
      "startDate": "2026-03-01T15:00:00",
      "stadium": "서울월드컵경기장",
      "homeTeam": "FC서울",
      "homeTeamScore": 2,
      "awayTeam": "전북",
      "awayTeamScore": 1,
      "reviewCount": 128,
      "matchRating": 4.2
    }
  ]
}
```

---

### `POST /api/v1/matches/{matchId}/match-reviews?userId={userId}`

경기 리뷰 작성.

**Request Body**
```json
{
  "content": "명경기였습니다.",
  "point": 4
}
```

**Response Body**
```json
{
  "id": 1
}
```

---

### `POST /api/v1/match-reviews/{matchReviewId}/likes?userId={userId}`

경기 리뷰 좋아요 토글.

**Response Body**
```json
{
  "isLiked": true,
  "totalLikeCount": 43
}
```

---

### `POST /api/v1/matches/{matchId}/player-reviews?userId={userId}`

선수 리뷰 작성.

**Request Body**
```json
{
  "playerId": 1,
  "content": "오늘도 훌륭했습니다.",
  "point": 5
}
```

**Response Body**
```json
{
  "id": 1
}
```

---

### `POST /api/v1/player-reviews/{playerReviewId}/likes?userId={userId}`

선수 리뷰 좋아요 토글.

**Response Body**
```json
{
  "isLiked": true,
  "totalLikeCount": 12
}
```

---

## 변경사항 요약

| 항목 | 변경 내용 |
|------|----------|
| `JwtAuthenticationFilter` | `Authorization` 헤더 외 `accessToken` 쿠키도 읽도록 추가 |
| `SecurityConfig` | permitAll 목록 `/google/signup` → `/oauth/signup` |
| `OAuth2AuthenticationSuccessHandler` | 기존 회원: accessToken을 쿠키로 설정, URL에는 `?userId=` 만 |
| `POST /api/v1/auth/oauth/signup` | 응답: `TokenResponse` → `UserResponse` + accessToken 쿠키 |
| `POST /api/v1/auth/reissue` | 응답: `TokenResponse` → `UserResponse` + accessToken 쿠키 |
