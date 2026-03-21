import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FundraisingButton } from "@/components/ui/fundraising-button";
import type { OrganizerApplication } from "@/types";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import {
  getApplicationStatus,
  normalizeOrganizerApplication,
} from "@/lib/organizerApplication";

interface OrganizerApplicationStatusCardProps {
  application: OrganizerApplication;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
  onReapply?: () => void;
}

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

export default function OrganizerApplicationStatusCard({
  application,
  onPrimaryAction,
  primaryActionLabel,
  onReapply,
}: OrganizerApplicationStatusCardProps) {
  const normalizedApplication = normalizeOrganizerApplication(application);
  const status = getApplicationStatus(normalizedApplication);

  const isPending = status === "pending";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  const headerClass = isPending
    ? "bg-linear-to-r from-amber-500 to-orange-500 text-white"
    : isApproved
      ? "bg-linear-to-r from-emerald-600 to-green-600 text-white"
      : "bg-linear-to-r from-rose-600 to-red-600 text-white";

  return (
    <Card className="bg-white shadow-xl border-0 overflow-hidden">
      <CardHeader className={headerClass}>
        <CardTitle className="flex items-center gap-3 text-xl">
          {isPending && <Clock3 className="h-6 w-6" />}
          {isApproved && <CheckCircle2 className="h-6 w-6" />}
          {isRejected && <XCircle className="h-6 w-6" />}
          {isPending && "Application Under Review"}
          {isApproved && "Application Approved"}
          {isRejected && "Application Rejected"}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 space-y-4">
        {isPending && (
          <>
            <Badge className="bg-amber-100 text-amber-700 border border-amber-200">
              Pending
            </Badge>
            <p className="text-gray-700">
              Your organizer application for{" "}
              <span className="font-semibold">
                {normalizedApplication.organizationName}
              </span>{" "}
              is currently pending admin review.
            </p>
            <div className="text-sm text-gray-500">
              <p>Submitted: {formatDate(normalizedApplication.createdAt)}</p>
            </div>
          </>
        )}

        {isApproved && (
          <>
            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
              Approved
            </Badge>
            <p className="text-gray-700">
              Your organizer application for{" "}
              <span className="font-semibold">
                {normalizedApplication.organizationName}
              </span>{" "}
              has been approved.
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Submitted: {formatDate(normalizedApplication.createdAt)}</p>
              <p>Reviewed: {formatDate(normalizedApplication.reviewedAt)}</p>
            </div>
          </>
        )}

        {isRejected && (
          <>
            <Badge className="bg-rose-100 text-rose-700 border border-rose-200">
              Rejected
            </Badge>
            <p className="text-gray-700">
              Your most recent organizer application was rejected. Review the
              feedback below.
            </p>
            <div className="space-y-3">
              {normalizedApplication.rejectionReason && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                    Rejection reason
                  </p>
                  <p className="text-sm text-rose-900 mt-1">
                    {normalizedApplication.rejectionReason}
                  </p>
                </div>
              )}
              {normalizedApplication.adminNotes && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Admin note
                  </p>
                  <p className="text-sm text-blue-900 mt-1">
                    {normalizedApplication.adminNotes}
                  </p>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Submitted: {formatDate(normalizedApplication.createdAt)}</p>
              <p>Reviewed: {formatDate(normalizedApplication.reviewedAt)}</p>
            </div>
          </>
        )}

        {onPrimaryAction && primaryActionLabel && (
          <FundraisingButton
            type="button"
            variant={isApproved ? "success" : "support"}
            onClick={onPrimaryAction}
          >
            {primaryActionLabel}
          </FundraisingButton>
        )}

        {isRejected && onReapply && (
          <FundraisingButton
            type="button"
            variant="support"
            onClick={onReapply}
          >
            Submit a New Application
          </FundraisingButton>
        )}
      </CardContent>
    </Card>
  );
}
