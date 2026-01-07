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
        mutationFn: donorOrganizerAPI.applyAsOrganizer,
        onSuccess: (data: any) => {
            onStepChange(2, data.data.applicationId);
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