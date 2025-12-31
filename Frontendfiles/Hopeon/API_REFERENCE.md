# Complete API Reference

## Quick Import

```typescript
import {
  // Axios instance
  api,
  
  // Public APIs
  authAPI,
  publicCampaignAPI,
  publicDonationAPI,
  
  // Donor APIs
  donorDonationAPI,
  donorOrganizerAPI,
  
  // Organizer APIs
  organizerCampaignAPI,
  organizerWithdrawalAPI,
  organizerDonationAPI,
  
  // Admin APIs
  adminCampaignAPI,
  adminDonationAPI,
  adminOrganizerAPI,
  adminWithdrawalAPI,
} from "@/features/api";
```

---

## 🔓 Public APIs

### Authentication (`authAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `register(data)` | POST `/auth/register` | Register new user |
| `login(data)` | POST `/auth/login` | Login user |
| `requestOtp(email, purpose)` | POST `/auth/request-otp` | Request OTP |
| `verifyOtp(email, otpCode, purpose)` | POST `/auth/verify-otp` | Verify OTP |
| `resetPassword(email, newPassword, otpCode)` | POST `/auth/reset-password` | Reset password |
| `getProfile()` | GET `/auth/profile` | Get user profile |
| `updateProfile(data)` | PUT `/auth/profile` | Update profile |

### Public Campaigns (`publicCampaignAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAllCampaigns(params?)` | GET `/campaigns` | Get approved campaigns |
| `getCampaignById(id)` | GET `/campaigns/:id` | Get campaign details |

### Public Donations (`publicDonationAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getCampaignDonations(campaignId, params?)` | GET `/donations/campaign/:id` | Get campaign donations |
| `getCampaignStats(campaignId)` | GET `/donations/stats/:id` | Get campaign stats |

---

## 💰 Donor APIs

### Donations (`donorDonationAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `createDonation(data)` | POST `/donations` | Create donation |
| `getMyDonations(params?)` | GET `/donations/my-donations` | Get user's donations |
| `getDonationStats()` | GET `/donations/stats` | Get overall stats |

### Organizer Application (`donorOrganizerAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `applyAsOrganizer(formData)` | POST `/organizer/apply` | Submit application |
| `getMyApplications()` | GET `/organizer/my-applications` | Get user's applications |

---

## 🎯 Organizer APIs

### Campaigns (`organizerCampaignAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `createCampaign(data)` | POST `/campaigns` | Create campaign |
| `updateCampaign(id, data)` | PUT `/campaigns/:id` | Update campaign |
| `closeCampaign(id, reason?)` | PATCH `/campaigns/:id/close` | Close campaign |
| `deleteCampaign(id)` | DELETE `/campaigns/:id` | Delete campaign |
| `getMyCampaigns(params?)` | GET `/campaigns` | Get own campaigns |
| `getCampaignById(id)` | GET `/campaigns/:id` | Get campaign details |

### Withdrawals (`organizerWithdrawalAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `createWithdrawal(data)` | POST `/withdrawals` | Create withdrawal |
| `getMyWithdrawals(params?)` | GET `/withdrawals/my-withdrawals` | Get own withdrawals |
| `getWithdrawalById(id)` | GET `/withdrawals/:id` | Get withdrawal details |

### Donations (`organizerDonationAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getCampaignDonations(campaignId, params?)` | GET `/donations/campaign/:id` | Get campaign donations |
| `getCampaignStats(campaignId)` | GET `/donations/stats/:id` | Get campaign stats |
| `getDonationStats()` | GET `/donations/stats` | Get overall stats |

---

## 👑 Admin APIs

### Campaigns (`adminCampaignAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAllCampaigns(params?)` | GET `/campaigns` | Get all campaigns |
| `getCampaignById(id)` | GET `/campaigns/:id` | Get campaign details |
| `approveCampaign(id)` | PATCH `/campaigns/:id/approve` | Approve campaign |
| `updateCampaign(id, data)` | PUT `/campaigns/:id` | Update campaign |
| `closeCampaign(id, reason?)` | PATCH `/campaigns/:id/close` | Close campaign |
| `deleteCampaign(id)` | DELETE `/campaigns/:id` | Delete campaign |

### Donations (`adminDonationAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAllDonations(params?)` | GET `/donations` | Get all donations |
| `updateDonationStatus(id, status, details?)` | PATCH `/donations/:id/status` | Update status |
| `getCampaignDonations(campaignId, params?)` | GET `/donations/campaign/:id` | Get campaign donations |
| `getDonationStats()` | GET `/donations/stats` | Get overall stats |
| `getCampaignStats(campaignId)` | GET `/donations/stats/:id` | Get campaign stats |

### Organizer Management (`adminOrganizerAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAllApplications(params?)` | GET `/organizer/applications` | Get all applications |
| `getApplicationById(id)` | GET `/organizer/applications/:id` | Get application details |
| `approveApplication(id)` | PATCH `/organizer/applications/:id/approve` | Approve application |
| `rejectApplication(id, reason)` | PATCH `/organizer/applications/:id/reject` | Reject application |
| `getAllOrganizers(params?)` | GET `/organizer` | Get all organizers |
| `revokeOrganizer(id, reason)` | PATCH `/organizer/:id/revoke` | Revoke privileges |
| `reinstateOrganizer(id)` | PATCH `/organizer/:id/reinstate` | Reinstate organizer |

### Withdrawals (`adminWithdrawalAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAllWithdrawals(params?)` | GET `/withdrawals` | Get all withdrawals |
| `getWithdrawalById(id)` | GET `/withdrawals/:id` | Get withdrawal details |
| `approveWithdrawal(id, message?)` | PATCH `/withdrawals/:id/approve` | Approve withdrawal |
| `rejectWithdrawal(id, message)` | PATCH `/withdrawals/:id/reject` | Reject withdrawal |
| `markWithdrawalAsPaid(id, reference?)` | PATCH `/withdrawals/:id/mark-paid` | Mark as paid |

---

## 📝 Common Parameters

### Pagination
```typescript
{
  page?: number;      // Default: 1
  limit?: number;     // Default: 10, Max: 100
}
```

### Campaign Filters
```typescript
{
  owner?: string;         // Filter by organizer ID
  isApproved?: boolean;   // Filter by approval status
  isClosed?: boolean;     // Filter by closed status
  search?: string;        // Search in title
  page?: number;
  limit?: number;
}
```

### Donation Filters
```typescript
{
  status?: "PENDING" | "COMPLETED" | "FAILED";
  method?: "paypal" | "crypto";
  campaign?: string;      // Filter by campaign ID
  page?: number;
  limit?: number;
}
```

### Application Filters
```typescript
{
  status?: "pending" | "approved" | "rejected";
  page?: number;
  limit?: number;
}
```

### Withdrawal Filters
```typescript
{
  status?: "pending" | "approved" | "rejected" | "paid";
  page?: number;
  limit?: number;
}
```

---

## 🔐 Authentication Flow

1. **Register**: `authAPI.register()` → Returns user + token
2. **Store Token**: `localStorage.setItem("token", token)`
3. **Auto-Attach**: Axios interceptor adds token to all requests
4. **Protected Routes**: Token required for protected endpoints
5. **Logout**: Clear token from localStorage
6. **401 Error**: Interceptor auto-redirects to login

---

## 🎨 Response Formats

### Success Response
```typescript
{
  success: true,
  message: "Operation successful",
  data: { ... }
}
```

### List Response
```typescript
{
  success: true,
  campaigns: [...],  // or donations, applications, etc.
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    pages: 10
  }
}
```

### Error Response
```typescript
{
  success: false,
  message: "Error message"
}
```

---

## 🚀 Usage Examples

### Complete Authentication Flow
```typescript
// 1. Register
const registerResponse = await authAPI.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
});

// 2. Store credentials
localStorage.setItem("token", registerResponse.data.token);
localStorage.setItem("user", JSON.stringify(registerResponse.data.user));

// 3. Request OTP for verification
await authAPI.requestOtp("john@example.com", "register");

// 4. Verify OTP
await authAPI.verifyOtp("john@example.com", "123456", "register");

// 5. Login (if needed)
const loginResponse = await authAPI.login({
  email: "john@example.com",
  password: "password123",
});
```

### Complete Campaign Creation Flow
```typescript
// 1. Apply as organizer (if donor)
const formData = new FormData();
formData.append("organizationName", "My Charity");
formData.append("description", "We help communities");
await donorOrganizerAPI.applyAsOrganizer(formData);

// 2. Wait for admin approval...

// 3. Create campaign (as approved organizer)
const campaign = await organizerCampaignAPI.createCampaign({
  title: "Build a School",
  description: "Help us build a school for 500 children",
  target: 50000,
  images: ["https://example.com/image.jpg"],
});

// 4. Wait for admin approval...

// 5. Campaign is now live!
```

### Complete Donation Flow
```typescript
// 1. Browse campaigns
const campaigns = await publicCampaignAPI.getAllCampaigns({
  search: "education",
  page: 1,
  limit: 10,
});

// 2. View campaign details
const campaign = await publicCampaignAPI.getCampaignById(campaigns.campaigns[0]._id);

// 3. Make donation
const donation = await donorDonationAPI.createDonation({
  campaign: campaign._id,
  amount: 100,
  method: "paypal",
  donorEmail: "donor@example.com",
  transactionId: "PAYPAL_TXN_123",
});

// 4. Admin updates status to COMPLETED
// Campaign's raised amount automatically increments
```

### Complete Withdrawal Flow
```typescript
// 1. Check campaign balance
const campaign = await organizerCampaignAPI.getCampaignById("campaignId");
console.log(`Available: $${campaign.raised}`);

// 2. Request withdrawal
const withdrawal = await organizerWithdrawalAPI.createWithdrawal({
  campaign: campaign._id,
  amountRequested: 10000,
  payoutMethod: "bank",
  bankDetails: {
    accountHolderName: "John Doe",
    bankName: "Bank of America",
    accountNumber: "1234567890",
    swiftCode: "BOFA123",
  },
  reason: "Need funds for project materials",
});

// 3. Admin approves
await adminWithdrawalAPI.approveWithdrawal(withdrawal._id);

// 4. Admin processes payment externally

// 5. Admin marks as paid
await adminWithdrawalAPI.markWithdrawalAsPaid(withdrawal._id, "REF123");

// Campaign's raised amount automatically decremented
```

---

## 📦 File Structure

```
src/
├── features/
│   └── api/
│       ├── axios.ts                    # Axios instance
│       ├── publicapi/
│       │   └── public.api.ts          # Public APIs
│       ├── donor/
│       │   └── donor.api.ts           # Donor APIs
│       ├── organizer/
│       │   └── organizer.api.ts       # Organizer APIs
│       ├── admin/
│       │   └── admin.api.ts           # Admin APIs
│       ├── index.ts                    # Central exports
│       └── README.md                   # Documentation
├── types/
│   ├── auth.types.ts                   # Auth types
│   ├── campaign.types.ts               # Campaign types
│   ├── donation.types.ts               # Donation types
│   ├── organizer.types.ts              # Organizer types
│   └── index.ts                        # Type exports
├── enums/
│   ├── app.enums.ts                    # All enums
│   └── index.ts                        # Enum exports
└── validations/
    ├── auth.schema.ts                  # Auth validation
    ├── campaign.schema.ts              # Campaign validation
    ├── organizer.schema.ts             # Organizer validation
    └── index.ts                        # Schema exports
```

---

## ✅ Implementation Checklist

- [x] Axios instance with interceptors
- [x] Public APIs (auth, campaigns, donations)
- [x] Donor APIs (donations, organizer application)
- [x] Organizer APIs (campaigns, withdrawals, donations)
- [x] Admin APIs (campaigns, donations, organizers, withdrawals)
- [x] TypeScript types for all requests/responses
- [x] Zod validation schemas
- [x] Comprehensive documentation
- [x] Error handling setup
- [x] Token management

---

## 🎯 Next Steps

1. **Create React Query Hooks** for data fetching and caching
2. **Build UI Components** using the API layer
3. **Implement Protected Routes** based on user roles
4. **Add Loading States** and error handling in components
5. **Test API Integration** with backend
6. **Add Toast Notifications** for user feedback
7. **Implement File Upload** for documents and images
8. **Add Payment Integration** (PayPal SDK, Crypto wallets)

---

## 🔗 Related Documentation

- Backend API Documentation: See main README
- TypeScript Types: `src/types/`
- Validation Schemas: `src/validations/`
- Enums: `src/enums/`
