export type NormalizedApplicationStatus = "pending" | "approved" | "rejected";

const STATUS_ALIASES: Record<string, NormalizedApplicationStatus> = {
  pending: "pending",
  review: "pending",
  in_review: "pending",
  approved: "approved",
  approve: "approved",
  accepted: "approved",
  rejected: "rejected",
  reject: "rejected",
  declined: "rejected",
  denied: "rejected",
};

function toKey(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function normalizeApplicationStatus(
  status: unknown,
): NormalizedApplicationStatus | null {
  const key = toKey(status);
  return STATUS_ALIASES[key] ?? null;
}

export function getApplicationStatus(
  application: Record<string, any>,
): NormalizedApplicationStatus {
  const normalized =
    normalizeApplicationStatus(application?.status) ??
    normalizeApplicationStatus(application?.applicationStatus) ??
    normalizeApplicationStatus(application?.reviewStatus);

  return normalized ?? "pending";
}

function pickFirstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

export function normalizeOrganizerApplication<T extends Record<string, any>>(
  application: T,
): T {
  const rejectionReason = pickFirstString(
    application?.rejectionReason,
    application?.rejectedReason,
    application?.rejection_reason,
    application?.rejection?.reason,
    application?.review?.rejectionReason,
    application?.review?.reason,
  );

  const adminNotes = pickFirstString(
    application?.adminNotes,
    application?.adminNote,
    application?.admin_notes,
    application?.adminMessage,
    application?.review?.adminNotes,
    application?.review?.note,
    application?.reviewerNote,
  );

  const reviewedAt = pickFirstString(
    application?.reviewedAt,
    application?.review?.reviewedAt,
    application?.review?.updatedAt,
  );

  return {
    ...application,
    status: getApplicationStatus(application),
    rejectionReason,
    adminNotes,
    reviewedAt,
  } as T;
}

export function extractApplicationsFromResponse(
  data: unknown,
): Record<string, any>[] {
  const root = (data ?? {}) as Record<string, any>;
  const candidates = [
    root,
    root.data,
    root.result,
    root.data?.data,
    root.data?.result,
    root.result?.data,
    root.result?.result,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (Array.isArray(candidate?.applications)) return candidate.applications;
    if (Array.isArray(candidate?.result?.applications)) {
      return candidate.result.applications;
    }
    if (Array.isArray(candidate?.data?.applications)) {
      return candidate.data.applications;
    }
  }

  return [];
}
