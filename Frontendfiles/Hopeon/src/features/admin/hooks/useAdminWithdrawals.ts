import { useQuery } from "@tanstack/react-query";
import { adminWithdrawalAPI } from "@/features/api";
import type { WithdrawalFilters } from "@/types";

export const useAdminWithdrawals = (filters?: WithdrawalFilters) => {
  return useQuery({
    queryKey: ["adminWithdrawals", filters],
    queryFn: () => adminWithdrawalAPI.getAllWithdrawals(filters),
  });
};

export const useAdminWithdrawalById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["adminWithdrawal", id],
    queryFn: () => adminWithdrawalAPI.getWithdrawalById(id!),
    enabled: !!id,
  });
};
