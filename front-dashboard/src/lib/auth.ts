import { useQuery } from "@tanstack/react-query";
import { api, loadAccessToken } from "./api";
import type { Me } from "./types";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<Me> => {
      loadAccessToken();
      const { data } = await api.get("/auth/me"); // -> { user, permissions }
      return data as Me;
    },
    staleTime: 60_000,
  });
}
