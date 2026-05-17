export const queryKeys = {
  matches: {
    all: ["matches"] as const,
    reviewable: (userId: number | null, filter?: string) =>
      ["matches", "reviewable", { userId, filter }] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    hot: (size: number) => ["reviews", "hot", size] as const,
  },
  user: {
    me: (userId: number | null) => ["user", "me", userId] as const,
  },
};
