import { useQuery } from "@tanstack/react-query";
import { organizerWithdrawalAPI } from "@/features/api";
import type { WithdrawalFilters } from "@/types";

export const useOrganizerWithdrawals = (filters?: WithdrawalFilters) => {
  return useQuery({
    queryKey: ["organizerWithdrawals", filters],
    queryFn: () => organizerWithdrawalAPI.getMyWithdrawals(filters),
  });
};

export const useOrganizerWithdrawalById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["organizerWithdrawal", id],
    queryFn: () => organizerWithdrawalAPI.getWithdrawalById(id!),
    enabled: !!id,
  });
};
