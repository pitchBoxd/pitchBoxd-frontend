import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("match/:id", "routes/match-detail.tsx"),
  route("rounds", "routes/rounds.tsx"),
  route("teams", "routes/teams.tsx"),
  route("teams/:id", "routes/team-detail.tsx"),
  route("players", "routes/players.tsx"),
  route("players/:id", "routes/player-detail.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
