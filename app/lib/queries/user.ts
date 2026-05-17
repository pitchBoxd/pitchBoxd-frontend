import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "@/lib/api/auth";
import { queryKeys } from "./keys";

export function useMyInfo(userId: number | null) {
  return useQuery({
    queryKey: queryKeys.user.me(userId),
    enabled: userId !== null,
    queryFn: () => getMyInfo(userId as number),
  });
}
