// Export axios instance
export { default as api } from "./axios";

// Export Public APIs
export { authAPI, publicCampaignAPI, publicDonationAPI } from "./publicapi/public.api";

// Export Donor APIs
export { donorDonationAPI, donorOrganizerAPI } from "./donor/donor.api";

// Export Organizer APIs
export {
  organizerCampaignAPI,
  organizerWithdrawalAPI,
  organizerDonationAPI,
} from "./organizer/organizer.api";

// Export Admin APIs
export {
  adminCampaignAPI,
  adminDonationAPI,
  adminOrganizerAPI,
  adminWithdrawalAPI,
} from "./admin/admin.api";
