import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/routes/routes";
import { updateCampaignSchema } from "@/validations";
import { toast } from "sonner";

import {
  useOrganizerCampaignActions,
  useOrganizerCampaignById,
} from "../hooks";

const editCampaignFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || value.trim().length === 0 || value.trim().length >= 10,
      "Description must be at least 10 characters",
    ),
  target: z
    .number({ message: "Target must be a number" })
    .positive("Target must be a positive number"),
  imagesText: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value.trim().length === 0) {
          return true;
        }

        const urls = value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);

        return urls.every((url) => z.string().url().safeParse(url).success);
      },
      { message: "Each image URL must be valid" },
    ),
});

type EditCampaignFormValues = z.infer<typeof editCampaignFormSchema>;

function extractCampaignFromResponse(
  data: unknown,
): Record<string, any> | null {
  const root = (data ?? {}) as Record<string, any>;
  const candidates = [root, root.data, root.result, root.data?.data];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      if (candidate._id || candidate.id || candidate.title) {
        return candidate as Record<string, any>;
      }

      if (candidate.campaign && typeof candidate.campaign === "object") {
        return candidate.campaign as Record<string, any>;
      }
    }
  }

  return null;
}

export default function EditCampaign() {
  const navigate = useNavigate();
  const { id } = useParams();
  const campaignQuery = useOrganizerCampaignById(id);
  const { updateCampaignAsync, isUpdating } = useOrganizerCampaignActions();

  const form = useForm<EditCampaignFormValues>({
    resolver: zodResolver(editCampaignFormSchema),
    defaultValues: {
      title: "",
      description: "",
      target: 0,
      imagesText: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (campaignQuery.isError) {
      const message =
        (campaignQuery.error as any)?.response?.data?.message ||
        (campaignQuery.error as any)?.message ||
        "Failed to load campaign";
      toast.error(message);
    }
  }, [campaignQuery.isError, campaignQuery.error]);

  useEffect(() => {
    const campaign = extractCampaignFromResponse(campaignQuery.data);
    if (!campaign) return;

    form.reset({
      title: String(campaign.title ?? ""),
      description: String(campaign.description ?? ""),
      target: Number(campaign.target ?? 0),
      imagesText: Array.isArray(campaign.images)
        ? campaign.images.join("\n")
        : "",
    });
  }, [campaignQuery.data, form]);

  const imagesText = form.watch("imagesText");
  const imagesPreviewCount = (imagesText || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean).length;

  const onSubmit = async (values: EditCampaignFormValues) => {
    if (!id) {
      toast.error("Campaign id is missing");
      return;
    }

    const imageUrls = (values.imagesText || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      title: values.title.trim(),
      description:
        values.description && values.description.trim().length > 0
          ? values.description.trim()
          : undefined,
      target: Number(values.target),
      images: imageUrls.length > 0 ? imageUrls : undefined,
    };

    const parsedPayload = updateCampaignSchema.parse(payload);

    try {
      await updateCampaignAsync({ id, data: parsedPayload });
      navigate(ROUTES.ORGANIZER_CAMPAIGNS);
    } catch {
      // Error toast is handled by mutation hook.
    }
  };

  if (campaignQuery.isLoading) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            Loading campaign...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Campaign
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Update campaign details and keep donors informed.
          </p>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link to={ROUTES.ORGANIZER_CAMPAIGNS}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Information</CardTitle>
          <CardDescription>
            Keep your campaign information accurate and transparent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Clean Water Access for Rural Schools"
                        maxLength={120}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Keep the title clear and specific so donors understand the
                      cause quickly.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the campaign impact, beneficiaries, and how funds will be used."
                        className="min-h-32"
                        maxLength={1500}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include goals, beneficiaries, and timeline to build trust.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funding Target</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        step="0.01"
                        placeholder="5000"
                        value={field.value ?? ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value === "" ? 0 : Number(value));
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the total amount needed to complete the campaign
                      objectives.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imagesText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ImagePlus className="h-4 w-4" />
                      Campaign Image URLs
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          "https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg"
                        }
                        className="min-h-28"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      One URL per line. Parsed images: {imagesPreviewCount}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isUpdating}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
