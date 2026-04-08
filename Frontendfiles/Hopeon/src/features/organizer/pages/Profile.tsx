import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, ShieldCheck, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { organizerProfileAPI, organizerResponseParsers } from "@/features/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  organizerProfileSchema,
  type OrganizerProfileInput,
} from "@/validations/organizer.schema";

type DocKey = "governmentId" | "bankProof" | "addressProof" | "taxDocument";

type ProfileDocument = {
  url: string;
  type: string;
  key?: string;
  source?: string;
};

const EMPTY_DOCUMENTS: Record<DocKey, ProfileDocument> = {
  governmentId: { url: "", type: "passport" },
  bankProof: { url: "", type: "bank_statement" },
  addressProof: { url: "", type: "utility_bill" },
  taxDocument: { url: "", type: "tax_id" },
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  verified: "bg-primary/15 text-primary border-primary/25",
  rejected: "bg-destructive/15 text-destructive border-destructive/25",
  pending: "bg-chart-4/15 text-chart-4 border-chart-4/25",
};

function statusClass(status: string | null | undefined) {
  if (!status) return "bg-muted text-muted-foreground";
  return STATUS_BADGE_CLASS[status] ?? "bg-muted text-muted-foreground";
}

export default function OrganizerProfile() {
  const [documents, setDocuments] =
    useState<Record<DocKey, ProfileDocument>>(EMPTY_DOCUMENTS);

  const form = useForm<OrganizerProfileInput>({
    resolver: zodResolver(organizerProfileSchema),
    defaultValues: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      swiftCode: "",
      iban: "",
      accountType: "savings",
      bankAddress: "",
      bankCountry: "",
      fullLegalName: "",
      dateOfBirth: "",
      nationality: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phoneNumber: "",
      taxId: "",
    },
  });

  const profileQuery = useQuery({
    queryKey: ["organizerProfile"],
    queryFn: async () => organizerProfileAPI.getProfile(),
    retry: 1,
  });

  const profileState = useMemo(
    () =>
      organizerResponseParsers.extractOrganizerProfileFromResponse(
        profileQuery.data,
      ),
    [profileQuery.data],
  );

  const verificationStatus = profileState.verificationStatus;
  const profile = profileState.profile as Record<string, any> | null;
  const rejectionReason =
    (profile?.rejectionReason as string | undefined) ?? "";
  const reusableDocumentsCount = Number(
    profileState.documentReuseSummary?.reusableDocumentsCount || 0,
  );
  const isVerificationApproved = verificationStatus === "verified";

  const uploadMutation = useMutation({
    mutationFn: async ({ file, docType }: { file: File; docType: DocKey }) => {
      const payload = new FormData();
      payload.append("document", file);
      payload.append("documentType", docType);
      return organizerProfileAPI.uploadProfileDocument(payload);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload document",
      );
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: OrganizerProfileInput) => {
      const payload = {
        bankDetails: {
          accountHolderName: values.accountHolderName,
          bankName: values.bankName,
          accountNumber: values.accountNumber,
          routingNumber: values.routingNumber,
          swiftCode: values.swiftCode,
          iban: values.iban,
          accountType: values.accountType,
          bankAddress: values.bankAddress,
          bankCountry: values.bankCountry,
        },
        documents: {
          governmentId: documents.governmentId,
          bankProof: documents.bankProof,
          addressProof: documents.addressProof,
          ...(documents.taxDocument.url
            ? { taxDocument: documents.taxDocument }
            : {}),
        },
        kycInfo: {
          fullLegalName: values.fullLegalName,
          dateOfBirth: values.dateOfBirth,
          nationality: values.nationality,
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode,
            country: values.country,
          },
          phoneNumber: values.phoneNumber,
          taxId: values.taxId,
        },
      };

      return organizerProfileAPI.upsertProfile(payload);
    },
    onSuccess: () => {
      toast.success("Organizer profile submitted for verification");
      profileQuery.refetch();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save organizer profile",
      );
    },
  });

  useEffect(() => {
    if (!profile) return;

    form.reset({
      accountHolderName: profile.bankDetails?.accountHolderName || "",
      bankName: profile.bankDetails?.bankName || "",
      accountNumber: profile.bankDetails?.accountNumber || "",
      routingNumber: profile.bankDetails?.routingNumber || "",
      swiftCode: profile.bankDetails?.swiftCode || "",
      iban: profile.bankDetails?.iban || "",
      accountType: profile.bankDetails?.accountType || "savings",
      bankAddress: profile.bankDetails?.bankAddress || "",
      bankCountry: profile.bankDetails?.bankCountry || "",
      fullLegalName: profile.kycInfo?.fullLegalName || "",
      dateOfBirth: profile.kycInfo?.dateOfBirth
        ? String(profile.kycInfo.dateOfBirth).slice(0, 10)
        : "",
      nationality: profile.kycInfo?.nationality || "",
      street: profile.kycInfo?.address?.street || "",
      city: profile.kycInfo?.address?.city || "",
      state: profile.kycInfo?.address?.state || "",
      postalCode: profile.kycInfo?.address?.postalCode || "",
      country: profile.kycInfo?.address?.country || "",
      phoneNumber: profile.kycInfo?.phoneNumber || "",
      taxId: profile.kycInfo?.taxId || "",
    });

    setDocuments((prev) => ({
      ...prev,
      ...(profileState.documentDefaults || {}),
      ...(profile.documents || {}),
    }));
  }, [form, profile, profileState.documentDefaults]);

  if (profileQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Organizer Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive mb-4">
              Unable to load organizer profile.
            </p>
            <Button variant="outline" onClick={() => profileQuery.refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: DocKey,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and PDF files are allowed");
      return;
    }

    const result: any = await uploadMutation.mutateAsync({ file, docType });
    setDocuments((prev) => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        url: result?.url || "",
        key: result?.key,
        source: "uploaded",
      },
    }));
    toast.success("Document uploaded successfully");
  };

  const onSubmit = async (values: OrganizerProfileInput) => {
    if (
      !documents.governmentId.url ||
      !documents.bankProof.url ||
      !documents.addressProof.url
    ) {
      toast.error("Please upload Government ID, Bank Proof, and Address Proof");
      return;
    }

    await saveMutation.mutateAsync(values);
  };

  return (
    <div className="min-h-screen surface-page px-4 py-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Organizer
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            Profile and Verification
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Set up your one-time KYC and bank profile to enable withdrawals.
          </p>
        </div>

        <Card className="border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Verification Status</span>
              <Badge className={statusClass(verificationStatus)}>
                {(verificationStatus || "not_submitted").toUpperCase()}
              </Badge>
            </CardTitle>
            <CardDescription>
              Withdrawals are enabled only when your organizer profile is
              verified.
            </CardDescription>
          </CardHeader>
          {verificationStatus === "rejected" && rejectionReason ? (
            <CardContent>
              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-destructive">
                <p className="font-medium">Review Feedback</p>
                <p className="mt-1 whitespace-pre-wrap">{rejectionReason}</p>
              </div>
            </CardContent>
          ) : null}
        </Card>

        {isVerificationApproved ? (
          <Card>
            <CardHeader>
              <CardTitle>Profile Already Approved</CardTitle>
              <CardDescription>
                Your organizer profile and KYC verification are approved. No
                further action is required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If your legal or bank details change, contact support to request
                a profile review update.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="accountHolderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="savings">Savings</SelectItem>
                            <SelectItem value="checking">Checking</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="swiftCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SWIFT Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="iban"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IBAN</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>KYC Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullLegalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Legal Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Verification Documents
                  </CardTitle>
                  <CardDescription>
                    Reused documents are prefilled from your approved organizer
                    application. Upload only missing documents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reusableDocumentsCount > 0 ? (
                    <div className="rounded-md border border-chart-2/20 bg-chart-2/5 p-3 text-sm text-chart-2">
                      {reusableDocumentsCount} document(s) reused from your
                      approved organizer application.
                    </div>
                  ) : null}

                  {(
                    [
                      ["governmentId", "Government ID", true],
                      ["bankProof", "Bank Proof", true],
                      ["addressProof", "Address Proof", true],
                      ["taxDocument", "Tax Document", false],
                    ] as [DocKey, string, boolean][]
                  ).map(([key, title, required]) => (
                    <div key={key} className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {title} {required ? "*" : "(Optional)"}
                        </p>
                        {documents[key].url ? (
                          <Badge>
                            {documents[key].source === "organizer_application"
                              ? "Reused"
                              : "Uploaded"}
                          </Badge>
                        ) : null}
                      </div>

                      <Label className="text-xs text-muted-foreground">
                        Document Type
                      </Label>
                      <Input
                        value={documents[key].type}
                        onChange={(event) =>
                          setDocuments((prev) => ({
                            ...prev,
                            [key]: { ...prev[key], type: event.target.value },
                          }))
                        }
                      />

                      <label className="flex items-center gap-2 cursor-pointer text-sm text-primary">
                        <Upload className="h-4 w-4" />
                        Upload file
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          className="hidden"
                          onChange={(event) => handleUpload(event, key)}
                          disabled={uploadMutation.isPending}
                        />
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={saveMutation.isPending || uploadMutation.isPending}
                className="w-full"
              >
                {saveMutation.isPending || uploadMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Submit for Verification
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
