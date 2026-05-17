import { api } from "./client";
import type { TokenResponse, UserResponse } from "./types";

export interface GoogleLoginRequest {
  authorizationCode: string;
}

export interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

export interface GoogleLoginResponse {
  isRegistered: boolean;
  accessToken: string;
  userInfo: GoogleUserInfo;
  idToken: string;
}

export interface GoogleSignupRequest {
  idToken: string;
  nickname: string;
  favoriteTeamId?: number;
}

export function googleLogin(body: GoogleLoginRequest) {
  return api.post<GoogleLoginResponse>("/api/v1/auth/google/login", { body });
}

export function googleSignup(body: GoogleSignupRequest) {
  return api.post<TokenResponse>("/api/v1/auth/google/signup", { body });
}

export function logout() {
  return api.post<TokenResponse>("/api/v1/auth/logout");
}

export function reissue() {
  return api.post<TokenResponse>("/api/v1/auth/reissue");
}

export function getMyInfo(userId: number) {
  return api.get<UserResponse>("/api/v1/users/me", {
    searchParams: { userId },
  });
}

export function checkEmailDuplicate(email: string) {
  return api.get<{ isDuplicated: boolean }>("/api/v1/users/exists", {
    searchParams: { email },
  });
}
