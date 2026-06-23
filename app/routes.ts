import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("match/:id", "routes/match-detail.tsx"),
  route("match/:id/reviews", "routes/match-reviews.tsx"),
  route("rounds", "routes/rounds.tsx"),
  route("teams", "routes/teams.tsx"),
  route("teams/:id", "routes/team-detail.tsx"),
  route("players", "routes/players.tsx"),
  route("players/:id", "routes/player-detail.tsx"),
  route("login", "routes/login.tsx"),
  route("login/callback", "routes/login-callback.tsx"),
  route("signup", "routes/signup.tsx"),
  route("profile", "routes/profile.tsx"),
  route("about", "routes/about.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
