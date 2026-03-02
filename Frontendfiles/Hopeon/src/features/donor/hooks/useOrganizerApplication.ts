import { donorOrganizerAPI } from "@/features/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";



interface UseOrganizerApplicationParams {
    onStepChange: (step: number, applicationId: string) => void;
    onSuccessRedirect: () => void;
}

interface DocumentMutationVariables {
    applicationId: string;
    formData: FormData;
}

export function useOrganizerApplication({ onStepChange, onSuccessRedirect}: UseOrganizerApplicationParams) {
    const applyMutation = useMutation({
        mutationFn: donorOrganizerAPI.OrganizerApplicationDraft,
        onSuccess: (response: any) => {
            // Backend returns: { success: true, message: "...", data: { application: { _id: "..." } } }
            const applicationId = response.data?.application?._id;
            if (!applicationId) {
                toast.error("Failed to get application ID from response");
                return;
            }
            onStepChange(2, applicationId);
            toast.success("✅ Basic info saved! Upload documents to continue.");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to submit application");
        },
    });

    const documentMutation = useMutation({
        mutationFn: ({ applicationId, formData}: DocumentMutationVariables) => donorOrganizerAPI.OrganizerDocument(applicationId, formData),
        onSuccess: () => {
      toast.success("🎉 Application submitted successfully!");
      onSuccessRedirect();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to upload documents");
    },
    });

    return {
        applyMutation,
        documentMutation
    };
    
}