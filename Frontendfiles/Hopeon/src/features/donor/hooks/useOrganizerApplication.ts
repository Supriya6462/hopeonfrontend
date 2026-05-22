import { donorOrganizerAPI } from "@/features/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";

interface UseOrganizerApplicationParams {
  onStepChange: (step: number, applicationId: string) => void;
  onSuccessRedirect: () => void;
}

interface DocumentMutationVariables {
  applicationId: string;
  formData: FormData;
}

export function useOrganizerApplication({
  onStepChange,
  onSuccessRedirect,
}: UseOrganizerApplicationParams) {
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: donorOrganizerAPI.OrganizerApplicationDraft,
    onSuccess: (response: unknown) => {
      // Backend returns: { success: true, message: "...", data: { application: { _id: "..." } } }
      if (!response || typeof response !== "object") {
        toast.error("Failed to get application ID from response");
        return;
      }

      const resp = response as Record<string, unknown>;
      const data = resp.data as Record<string, unknown> | undefined;
      const application = data?.application as
        | Record<string, unknown>
        | undefined;
      const applicationId =
        typeof application?._id === "string"
          ? (application._id as string)
          : undefined;

      if (!applicationId) {
        toast.error("Failed to get application ID from response");
        return;
      }

      onStepChange(2, applicationId);
      toast.success("✅ Basic info saved! Upload documents to continue.");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to submit application"));
    },
  });

  const documentMutation = useMutation({
    mutationFn: ({ applicationId, formData }: DocumentMutationVariables) =>
      donorOrganizerAPI.OrganizerDocument(applicationId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrganizerApplications"] });
      queryClient.invalidateQueries({ queryKey: ["myOrganizerDraft"] });
      toast.success("🎉 Application submitted successfully!");
      onSuccessRedirect();
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to upload documents"));
    },
  });

  return {
    applyMutation,
    documentMutation,
  };
}
