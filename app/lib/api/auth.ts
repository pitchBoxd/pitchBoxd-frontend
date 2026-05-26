import { api } from "./client";
import type { TokenResponse, UserResponse } from "./types";

export interface OAuthSignupRequest {
  signupToken: string;
  nickname: string;
  favoriteTeamId?: number;
}

export function oauthSignup(body: OAuthSignupRequest) {
  return api.post<UserResponse>("/api/v1/auth/oauth/signup", { body });
}

export function logout() {
  return api.post<void>("/api/v1/auth/logout");
}

export function reissue() {
  return api.post<UserResponse>("/api/v1/auth/reissue");
}

export function getMyInfo() {
  return api.get<UserResponse>("/api/v1/users/me");
}

export function checkEmailDuplicate(email: string) {
  return api.get<{ isDuplicated: boolean }>("/api/v1/users/exists", {
    searchParams: { email },
  });
}
