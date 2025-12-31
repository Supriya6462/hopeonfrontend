# API Layer Documentation

This directory contains all API calls organized by user role and functionality.

## Structure

```
api/
├── axios.ts                    # Axios instance with interceptors
├── publicapi/
│   └── public.api.ts          # Public APIs (auth, campaigns, donations)
├── donor/
│   └── donor.api.ts           # Donor-specific APIs
├── organizer/
│   └── organizer.api.ts       # Organizer-specific APIs
├── admin/
│   └── admin.api.ts           # Admin-specific APIs
└── index.ts                    # Central export file
```

## Usage

### Import APIs

```typescript
import {
  authAPI,
  publicCampaignAPI,
  donorDonationAPI,
  organizerCampaignAPI,
  adminCampaignAPI,
} from "@/features/api";
```

### Authentication

```typescript
// Register
const response = await authAPI.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  phoneNumber: "+1234567890",
});

// Login
const response = await authAPI.login({
  email: "john@example.com",
  password: "password123",
});

// Store token
localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));

// Request OTP
await authAPI.requestOtp("john@example.com", "register");

// Verify OTP
await authAPI.verifyOtp("john@example.com", "123456", "register");

// Get Profile
const profile = await authAPI.getProfile();

// Update Profile
await authAPI.updateProfile({ name: "John Updated" });
```

### Public Campaign APIs

```typescript
// Get all approved campaigns
const campaigns = await publicCampaignAPI.getAllCampaigns({
  search: "education",
  page: 1,
  limit: 10,
});

// Get single campaign
const campaign = await publicCampaignAPI.getCampaignById("campaignId");
```

### Donor APIs

```typescript
// Create donation
const donation = await donorDonationAPI.createDonation({
  campaign: "campaignId",
  amount: 100,
  method: "paypal",
  donorEmail: "donor@example.com",
  transactionId: "txn_123",
});

// Get my donations
const myDonations = await donorDonationAPI.getMyDonations({
  page: 1,
  limit: 10,
});

// Apply as organizer
const formData = new FormData();
formData.append("organizationName", "My Org");
formData.append("description", "Description");
const application = await donorOrganizerAPI.applyAsOrganizer(formData);

// Get my applications
const applications = await donorOrganizerAPI.getMyApplications();
```

### Organizer APIs

```typescript
// Create campaign
const campaign = await organizerCampaignAPI.createCampaign({
  title: "Help Build School",
  description: "We need funds to build a school",
  target: 50000,
  images: ["https://example.com/image.jpg"],
});

// Update campaign
await organizerCampaignAPI.updateCampaign("campaignId", {
  title: "Updated Title",
});

// Close campaign
await organizerCampaignAPI.closeCampaign("campaignId", "Goal reached");

// Get my campaigns
const myCampaigns = await organizerCampaignAPI.getMyCampaigns({
  page: 1,
  limit: 10,
});

// Create withdrawal request
const withdrawal = await organizerWithdrawalAPI.createWithdrawal({
  campaign: "campaignId",
  amountRequested: 10000,
  payoutMethod: "bank",
  bankDetails: {
    accountHolderName: "John Doe",
    bankName: "Bank of America",
    accountNumber: "1234567890",
  },
});

// Get my withdrawals
const withdrawals = await organizerWithdrawalAPI.getMyWithdrawals();
```

### Admin APIs

```typescript
// Get all campaigns (including unapproved)
const allCampaigns = await adminCampaignAPI.getAllCampaigns({
  isApproved: false,
  page: 1,
  limit: 10,
});

// Approve campaign
await adminCampaignAPI.approveCampaign("campaignId");

// Get all donations
const allDonations = await adminDonationAPI.getAllDonations({
  status: "PENDING",
  page: 1,
  limit: 10,
});

// Update donation status
await adminDonationAPI.updateDonationStatus("donationId", "COMPLETED", {
  transactionId: "txn_123",
});

// Get all applications
const applications = await adminOrganizerAPI.getAllApplications({
  status: "pending",
});

// Approve application
await adminOrganizerAPI.approveApplication("applicationId");

// Reject application
await adminOrganizerAPI.rejectApplication(
  "applicationId",
  "Insufficient documentation"
);

// Revoke organizer
await adminOrganizerAPI.revokeOrganizer("userId", "Violation of terms");

// Reinstate organizer
await adminOrganizerAPI.reinstateOrganizer("userId");

// Get all withdrawals
const withdrawals = await adminWithdrawalAPI.getAllWithdrawals({
  status: "pending",
});

// Approve withdrawal
await adminWithdrawalAPI.approveWithdrawal("withdrawalId", "Approved");

// Mark as paid
await adminWithdrawalAPI.markWithdrawalAsPaid("withdrawalId", "REF123");
```

## Error Handling

All API calls should be wrapped in try-catch blocks:

```typescript
try {
  const response = await authAPI.login(credentials);
  // Handle success
} catch (error: any) {
  const message = error.response?.data?.message || "An error occurred";
  console.error(message);
  // Show error to user
}
```

## Axios Interceptors

### Request Interceptor
- Automatically adds JWT token from localStorage to all requests
- Token is added as `Authorization: Bearer <token>` header

### Response Interceptor
- Handles 401 Unauthorized errors
- Automatically clears token and redirects to login on 401

## Environment Variables

Make sure to set the backend URL in your `.env` file:

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

## TypeScript Types

All request/response types are defined in `src/types/`:
- `auth.types.ts` - Authentication types
- `campaign.types.ts` - Campaign types
- `donation.types.ts` - Donation types
- `organizer.types.ts` - Organizer and withdrawal types

## Best Practices

1. **Always use try-catch** for error handling
2. **Store token securely** in localStorage or httpOnly cookies
3. **Clear token on logout** and 401 errors
4. **Use TypeScript types** for type safety
5. **Handle loading states** in your components
6. **Show user-friendly error messages**
