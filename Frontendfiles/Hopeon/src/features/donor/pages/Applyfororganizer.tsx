import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FundraisingButton } from "@/components/ui/fundraising-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes/routes";
import { submitApplicationSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  FileText,
  Shield,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useOrganizerApplication } from "../hooks/useOrganizerApplication";
import { buildOrganizerDocuments } from "../hooks/buildOrganizerDocuments";
import { useLatestOrganizerApplication } from "../hooks/useOrganizerApplicationQueries";
import type { OrganizerDocuments } from "@/types";
import { DocumentUploader } from "@/components/shared";
import OrganizerApplicationStatusCard from "../components/OrganizerApplicationStatusCard";
import { getApplicationStatus } from "@/lib/organizerApplication";

type ApplicationViewState = "form" | "pending" | "approved" | "rejected";

// Enhanced Zod schema
// const applicationSchema = z.object({
//   organizationName: z
//     .string()
//     .min(3, "Organization name must be at least 3 characters")
//     .max(100, "Organization name must be less than 100 characters"),
//   description: z
//     .string()
//     .min(50, "Please provide at least 50 characters describing your cause")
//     .max(1000, "Description must be less than 1000 characters"),
//   contactEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
//   phoneNumber: z.string().optional(),
//   website: z.string().url("Invalid URL").optional().or(z.literal("")),
//   organizationType: z.enum(["nonprofit", "charity", "individual", "business", "other"]),
// });

export default function Applyfororganizer() {
  // CHANGED: Use the hook instead of useContext
  const { user, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isReapplying, setIsReapplying] = useState(false);

  const {
    latestApplication,
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
    error: applicationsError,
  } = useLatestOrganizerApplication();

  // FIXED: Proper type and correct naming
  const [documents, setDocuments] = useState<OrganizerDocuments>({
    governmentId: null,
    selfieWithId: null,
    registrationCertificate: null,
    taxId: null,
    addressProof: null,
  });

  // Form setup
  const form = useForm({
    resolver: zodResolver(submitApplicationSchema),
    defaultValues: {
      organizationName: "",
      description: "",
      website: "",
      contactEmail: user?.email || "",
      phoneNumber: "",
      organizationType: "other" as const, // FIXED: Type assertion
    },
  });

  // FIXED: Proper typing for callbacks
  const { applyMutation, documentMutation } = useOrganizerApplication({
    onStepChange: (step: number, id: string) => {
      setStep(step);
      setApplicationId(id);
    },
    onSuccessRedirect: () =>
      navigate(ROUTES.APPLY_ORGANIZER, { replace: true }),
  });

  const applicationViewState = useMemo<ApplicationViewState>(() => {
    if (!latestApplication || isReapplying) {
      return "form";
    }

    const status = getApplicationStatus(latestApplication);

    if (status === "pending") {
      return "pending";
    }

    if (status === "approved") {
      return "approved";
    }

    if (status === "rejected") {
      return "rejected";
    }

    return "form";
  }, [latestApplication, isReapplying]);

  const shouldShowPendingStatus = applicationViewState === "pending";
  const shouldShowApprovedStatus = applicationViewState === "approved";
  const shouldShowRejectedStatus = applicationViewState === "rejected";
  const shouldShowForm = applicationViewState === "form";

  // FIXED: Proper typing for form values
  const onSubmitBasicInfo = (values: any) => {
    // Convert form data to JSON for draft application
    const applicationData = {
      organizationName: values.organizationName,
      description: values.description,
      contactEmail: values.contactEmail || undefined,
      phoneNumber: values.phoneNumber || undefined,
      website: values.website || undefined,
      organizationType: values.organizationType,
    };

    applyMutation.mutate(applicationData);
  };

  // Document submission handler
  const onSubmitDocuments = () => {
    try {
      const formData = buildOrganizerDocuments(documents);

      if (!applicationId) {
        toast.error("Application ID is missing");
        return;
      }

      documentMutation.mutate({
        applicationId,
        formData,
      });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  // Loading state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isApplicationsLoading) {
    return (
      <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application status...</p>
        </div>
      </div>
    );
  }

  if (
    isApplicationsError &&
    (applicationsError as any)?.response?.status !== 404
  ) {
    return (
      <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-red-50 border border-red-200 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-red-900 mb-1">
            Unable to load your application status
          </h2>
          <p className="text-red-700 text-sm">
            {(applicationsError as any)?.message ||
              "Something went wrong while loading your organizer application."}
          </p>
          <FundraisingButton
            type="button"
            variant="outline-support"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </FundraisingButton>
        </div>
      </div>
    );
  }

  // Submit basic application
  //   const applicationMutation = useMutation({
  //     mutationFn: donorOrganizerAPI.applyAsOrganizer,
  //     onSuccess: (data) => {
  //       setApplicationId(data.applicationId);
  //       setStep(2); // Move to documents step
  //       toast.success("✅ Basic info saved! Now upload your verification documents to submit your application.");
  //     },
  //     onError: (err) => {
  //       toast.error(err.message || "Failed to submit application");
  //     },
  //   });

  //   // Upload documents
  //   const documentsMutation = useMutation({
  //     mutationFn: ({applicationId, formdata}) => donorOrganizerAPI.OrganizerDocument(applicationId,formdata),

  //     onSuccess: () => {
  //       toast.success(
  //         "🎉 Application submitted successfully! Your application is now pending admin review. We'll notify you within 2-3 business days.",
  //         { duration: 6000 }
  //       );
  //       // Redirect to home after a brief delay
  //       setTimeout(() => {
  //         navigate(ROUTES.HOME);
  //       }, 2000);
  //     },
  //     onError: (err) => {
  //       toast.error(err.message || "Failed to upload documents");
  //     },
  //   });

  //   const onSubmitBasicInfo = (values) => {
  //     applicationMutation.mutate(values);
  //   };

  //   const onSubmitDocuments = () => {
  //     // Validate required documents
  //     if (!documents.governmentId || !documents.selfieWithId) {
  //       toast.error("Please upload required identity documents (Government ID and Selfie with ID)");
  //       return;
  //     }

  //     // Create FormData
  //     const formData = new FormData();

  //     if (documents.governmentId) {
  //       formData.append("governmentId", documents.governmentId);
  //     }
  //     if (documents.selfieWithId) {
  //       formData.append("selfieWithId", documents.selfieWithId);
  //     }
  //     if (documents.registrationCertificate) {
  //       formData.append("registrationCertificate", documents.registrationCertificate);
  //     }
  //     if (documents.taxId) {
  //       formData.append("taxId", documents.taxId);
  //     }
  //     if (documents.addressProof) {
  //       formData.append("addressProof", documents.addressProof);
  //     }

  //     // Upload documents
  //     documentsMutation.mutate(formData);
  //   };

  //   if (loading) {
  //     return (
  //       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //           <p className="text-gray-600">Loading...</p>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Badge className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 text-sm font-medium mb-6">
            <UserCheck className="h-4 w-4 mr-2" />
            Organizer Application
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-linear-to-r from-purple-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Become a Campaign
            </span>
            <br />
            <span className="text-gray-800">Organizer</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join our trusted community of organizers and start creating
            meaningful change in your community and beyond.
          </p>
        </div>

        {shouldShowPendingStatus && latestApplication && (
          <div className="mb-8">
            <OrganizerApplicationStatusCard
              application={latestApplication}
              onPrimaryAction={() => navigate(ROUTES.APPLY_ORGANIZER)}
              primaryActionLabel="Refresh Status"
            />
          </div>
        )}

        {shouldShowApprovedStatus && latestApplication && (
          <div className="mb-8">
            <OrganizerApplicationStatusCard
              application={latestApplication}
              onPrimaryAction={() =>
                navigate(
                  user?.role === "organizer"
                    ? ROUTES.ORGANIZER_DASHBOARD
                    : ROUTES.DONOR_DASHBOARD,
                )
              }
              primaryActionLabel={
                user?.role === "organizer"
                  ? "Go to Organizer Dashboard"
                  : "Go to Dashboard"
              }
            />
          </div>
        )}

        {shouldShowRejectedStatus && latestApplication && (
          <div className="mb-8">
            <OrganizerApplicationStatusCard
              application={latestApplication}
              onReapply={() => {
                setIsReapplying(true);
                setStep(1);
                setApplicationId(null);
                setDocuments({
                  governmentId: null,
                  selfieWithId: null,
                  registrationCertificate: null,
                  taxId: null,
                  addressProof: null,
                });
              }}
            />
          </div>
        )}

        {shouldShowForm && (
          <>
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4">
                <div
                  className={`flex items-center gap-2 ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 1 ? "bg-blue-600 text-white" : "bg-gray-300"
                    }`}
                  >
                    1
                  </div>
                  <span className="font-medium">Basic Info</span>
                </div>
                <ArrowRight className="text-gray-400" />
                <div
                  className={`flex items-center gap-2 ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"
                    }`}
                  >
                    2
                  </div>
                  <span className="font-medium">Documents</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 1: Basic Information */}
        {shouldShowForm && step === 1 && (
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-linear-to-r from-purple-600 to-indigo-600 text-white">
              <CardTitle className="flex items-center gap-3 text-xl">
                <FileText className="h-6 w-6" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form
                onSubmit={form.handleSubmit(onSubmitBasicInfo)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="organizationName">
                      Organization / Group Name *
                    </Label>
                    <Input
                      id="organizationName"
                      {...form.register("organizationName")}
                      placeholder="e.g. Clean Water Initiative"
                      className="h-11 border-2"
                    />
                    {form.formState.errors.organizationName && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.organizationName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="organizationType">
                      Organization Type *
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue(
                          "organizationType",
                          value as
                            | "nonprofit"
                            | "charity"
                            | "individual"
                            | "business"
                            | "other",
                        )
                      }
                      defaultValue="other"
                    >
                      <SelectTrigger className="h-11 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nonprofit">
                          Non-Profit Organization
                        </SelectItem>
                        <SelectItem value="charity">
                          Registered Charity
                        </SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="business">
                          Social Enterprise/Business
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Describe Your Cause *</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      {...form.register("description")}
                      placeholder="Tell us about your mission, the problems you're solving, and the impact you want to create..."
                      className="border-2 resize-none"
                    />
                    <div className="flex justify-between items-center mt-1">
                      {form.formState.errors.description && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.description.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {form.watch("description")?.length || 0}/1000 characters
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        {...form.register("contactEmail")}
                        placeholder="contact@organization.org"
                        className="h-11 border-2"
                      />
                      {form.formState.errors.contactEmail && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.contactEmail.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        {...form.register("phoneNumber")}
                        placeholder="+1 (555) 123-4567"
                        className="h-11 border-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      type="url"
                      {...form.register("website")}
                      placeholder="https://yourorganization.org"
                      className="h-11 border-2"
                    />
                    {form.formState.errors.website && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.website.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">
                        Next Step: Document Verification
                      </p>
                      <p>
                        After submitting this form, you'll need to upload
                        verification documents including: Government ID, Selfie
                        with ID, and other supporting documents.
                      </p>
                    </div>
                  </div>
                </div>

                <FundraisingButton
                  type="submit"
                  variant="support"
                  size="lg"
                  fullWidth
                  loading={applyMutation.isPending}
                  loadingText="Submitting..."
                  disabled={applyMutation.isPending}
                >
                  <ArrowRight className="h-5 w-5" />
                  Continue to Documents
                </FundraisingButton>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Document Upload */}
        {shouldShowForm && step === 2 && (
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-linear-to-r from-green-600 to-emerald-600 text-white">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Shield className="h-6 w-6" />
                Verification Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">
                      ⚡ Final Step - Required Documents
                    </p>
                    <p>
                      Upload clear, legible copies of your documents.{" "}
                      <strong>
                        Government ID and Selfie with ID are required.
                      </strong>{" "}
                      Once you submit, your application will be sent to admin
                      for review.
                    </p>
                  </div>
                </div>
              </div>

              {/* Identity Verification */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                  Identity Verification (Required)
                </h3>

                <DocumentUploader
                  label="Government-Issued ID"
                  description="Passport, Driver's License, or National ID Card"
                  required
                  onFileSelect={(file) =>
                    setDocuments((prev) => ({ ...prev, governmentId: file }))
                  }
                />

                <DocumentUploader
                  label="Selfie with ID"
                  description="Take a photo of yourself holding your ID next to your face"
                  required
                  onFileSelect={(file) =>
                    setDocuments((prev) => ({ ...prev, selfieWithId: file }))
                  }
                />
              </div>

              {/* Organization Documents */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Organization Documents (Optional but Recommended)
                </h3>

                <DocumentUploader
                  label="Registration Certificate"
                  description="For nonprofits/charities: Official registration documents"
                  onFileSelect={(file) =>
                    setDocuments((prev) => ({
                      ...prev,
                      registrationCertificate: file,
                    }))
                  }
                />

                <DocumentUploader
                  label="Tax ID / EIN"
                  description="Tax identification number document"
                  onFileSelect={(file) =>
                    setDocuments((prev) => ({ ...prev, taxId: file }))
                  }
                />

                <DocumentUploader
                  label="Address Proof"
                  description="Utility bill or bank statement (within last 3 months)"
                  onFileSelect={(file) =>
                    setDocuments((prev) => ({ ...prev, addressProof: file }))
                  }
                />
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <FundraisingButton
                  type="button"
                  variant="ghost-trust"
                  size="lg"
                  onClick={() => setStep(1)}
                  disabled={documentMutation.isPending}
                  className="flex-1"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </FundraisingButton>

                <FundraisingButton
                  type="button"
                  variant="success"
                  size="lg"
                  onClick={onSubmitDocuments}
                  loading={documentMutation.isPending}
                  loadingText="Uploading..."
                  disabled={
                    documentMutation.isPending ||
                    !documents.governmentId ||
                    !documents.selfieWithId
                  }
                  className="flex-1"
                >
                  <Sparkles className="h-5 w-5" />
                  Submit Application
                </FundraisingButton>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
