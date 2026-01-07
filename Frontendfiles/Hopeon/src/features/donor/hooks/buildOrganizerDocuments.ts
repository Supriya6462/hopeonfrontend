import type { OrganizerDocuments } from "@/types";

export function buildOrganizerDocuments(documents: OrganizerDocuments): FormData {
  // Validate required documents
  if (!documents.governmentId || !documents.selfieWithId) {
    throw new Error("Required documents missing: Government ID and Selfie with ID are mandatory");
  }

  const formData = new FormData();

  // Type-safe iteration over document entries
  Object.entries(documents).forEach(([key, value]) => {
    // Skip if no value
    if (!value) return;

    // Handle array of files (additionalDocuments)
    if (Array.isArray(value)) {
      value.forEach((file: File) => {
        formData.append(key, file);
      });
    } 
    // Handle single file
    else if (value instanceof File) {
      formData.append(key, value);
    }
  });

  return formData;
}