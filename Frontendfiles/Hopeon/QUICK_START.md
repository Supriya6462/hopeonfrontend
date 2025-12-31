# Quick Start Guide - Frontend API Integration

## 🚀 Getting Started in 5 Minutes

### Step 1: Environment Setup

Create or update your `.env` file:

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

### Step 2: Import APIs

```typescript
import { authAPI, publicCampaignAPI, donorDonationAPI } from "@/features/api";
```

### Step 3: Use in Your Components

#### Example: Login Component

```typescript
import { useState } from "react";
import { authAPI } from "@/features/api";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login({ email, password });
      
      // Store token and user
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Redirect based on role
      const role = response.data.user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "organizer") navigate("/organizer/dashboard");
      else navigate("/");
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
```

#### Example: Campaign List Component

```typescript
import { useEffect, useState } from "react";
import { publicCampaignAPI } from "@/features/api";
import type { Campaign } from "@/types";

export const CampaignList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await publicCampaignAPI.getAllCampaigns({
          page: 1,
          limit: 10,
        });
        setCampaigns(response.campaigns);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="campaign-grid">
      {campaigns.map((campaign) => (
        <div key={campaign._id} className="campaign-card">
          <h3>{campaign.title}</h3>
          <p>{campaign.description}</p>
          <div className="progress">
            <span>${campaign.raised}</span> / <span>${campaign.target}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(campaign.raised / campaign.target) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
```

#### Example: Create Campaign (Organizer)

```typescript
import { useState } from "react";
import { organizerCampaignAPI } from "@/features/api";
import { useNavigate } from "react-router-dom";

export const CreateCampaignPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: 0,
    images: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await organizerCampaignAPI.createCampaign(formData);
      alert("Campaign created! Awaiting admin approval.");
      navigate("/organizer/campaigns");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Campaign Title"
        required
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Description"
      />
      <input
        type="number"
        value={formData.target}
        onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
        placeholder="Target Amount"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Campaign"}
      </button>
    </form>
  );
};
```

#### Example: Make Donation

```typescript
import { useState } from "react";
import { donorDonationAPI } from "@/features/api";

export const DonationForm = ({ campaignId }: { campaignId: string }) => {
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In real app, integrate PayPal SDK here
      const response = await donorDonationAPI.createDonation({
        campaign: campaignId,
        amount,
        method: "paypal",
        donorEmail: email,
        transactionId: "MOCK_TXN_" + Date.now(), // Replace with real transaction ID
      });
      
      alert("Donation successful! Thank you for your support.");
      setAmount(0);
      setEmail("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Donation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDonate}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Amount"
        min="1"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Donate Now"}
      </button>
    </form>
  );
};
```

## 🎯 Common Patterns

### Pattern 1: Protected API Calls

```typescript
// The token is automatically attached by axios interceptor
// Just make the call - no need to manually add headers

const campaigns = await organizerCampaignAPI.getMyCampaigns();
// Token from localStorage is automatically included
```

### Pattern 2: Error Handling

```typescript
try {
  const response = await authAPI.login(credentials);
  // Success
} catch (error: any) {
  // Extract error message
  const message = error.response?.data?.message || "An error occurred";
  
  // Show to user
  toast.error(message);
  // or setError(message);
}
```

### Pattern 3: Loading States

```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await someAPI.getData();
    // Handle data
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false); // Always runs
  }
};
```

### Pattern 4: Pagination

```typescript
const [page, setPage] = useState(1);
const [campaigns, setCampaigns] = useState([]);
const [pagination, setPagination] = useState(null);

const fetchCampaigns = async () => {
  const response = await publicCampaignAPI.getAllCampaigns({
    page,
    limit: 10,
  });
  setCampaigns(response.campaigns);
  setPagination(response.pagination);
};

// In JSX
<button onClick={() => setPage(page - 1)} disabled={page === 1}>
  Previous
</button>
<button onClick={() => setPage(page + 1)} disabled={page === pagination?.pages}>
  Next
</button>
```

### Pattern 5: Search/Filter

```typescript
const [search, setSearch] = useState("");
const [campaigns, setCampaigns] = useState([]);

// Debounce search
useEffect(() => {
  const timer = setTimeout(() => {
    fetchCampaigns();
  }, 500);
  
  return () => clearTimeout(timer);
}, [search]);

const fetchCampaigns = async () => {
  const response = await publicCampaignAPI.getAllCampaigns({
    search,
    page: 1,
    limit: 10,
  });
  setCampaigns(response.campaigns);
};
```

## 🔐 Authentication Flow

### Complete Auth Flow

```typescript
// 1. Register
const registerUser = async (data) => {
  const response = await authAPI.register(data);
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
};

// 2. Login
const loginUser = async (credentials) => {
  const response = await authAPI.login(credentials);
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
};

// 3. Get Current User
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// 4. Logout
const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// 5. Check if Authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
```

### Protected Route Component

```typescript
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && userStr) {
    const user = JSON.parse(userStr);
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
  }
  
  return <>{children}</>;
};

// Usage in routes
<Route
  path="/organizer/*"
  element={
    <ProtectedRoute allowedRoles={["organizer"]}>
      <OrganizerDashboard />
    </ProtectedRoute>
  }
/>
```

## 📦 Recommended Folder Structure

```
src/
├── features/
│   └── api/              # ✅ Already implemented
├── hooks/
│   ├── useAuth.ts        # Auth hook
│   ├── useCampaigns.ts   # Campaign hooks
│   └── useDonations.ts   # Donation hooks
├── contexts/
│   └── AuthContext.tsx   # Auth context
├── components/
│   ├── auth/
│   ├── campaign/
│   ├── donation/
│   └── shared/
├── pages/
│   ├── donor/
│   ├── organizer/
│   └── admin/
└── utils/
    ├── formatters.ts     # Format currency, dates, etc.
    └── validators.ts     # Additional validation
```

## 🎨 With React Query (Recommended)

### Install React Query

```bash
npm install @tanstack/react-query
```

### Setup Query Client

```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

### Create Custom Hooks

```typescript
// src/hooks/useCampaigns.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { publicCampaignAPI, organizerCampaignAPI } from "@/features/api";

export const useCampaigns = (filters = {}) => {
  return useQuery({
    queryKey: ["campaigns", filters],
    queryFn: () => publicCampaignAPI.getAllCampaigns(filters),
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: organizerCampaignAPI.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
};
```

### Use in Components

```typescript
import { useCampaigns, useCreateCampaign } from "@/hooks/useCampaigns";

export const CampaignList = () => {
  const { data, isLoading, error } = useCampaigns({ page: 1, limit: 10 });
  const createMutation = useCreateCampaign();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading campaigns</div>;

  return (
    <div>
      {data?.campaigns.map((campaign) => (
        <div key={campaign._id}>{campaign.title}</div>
      ))}
    </div>
  );
};
```

## ✅ Checklist for Your Implementation

- [ ] Set up environment variables
- [ ] Test authentication flow (register, login, logout)
- [ ] Implement protected routes
- [ ] Create auth context/hook
- [ ] Build campaign listing page
- [ ] Build campaign detail page
- [ ] Implement donation flow
- [ ] Create organizer dashboard
- [ ] Create admin panel
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add success notifications
- [ ] Test all user roles
- [ ] Integrate payment gateways
- [ ] Add file upload for documents

## 🚀 You're Ready!

The API layer is fully implemented and ready to use. Start building your UI components and connect them using the patterns shown above.

For detailed API documentation, see:
- `API_REFERENCE.md` - Complete API reference
- `src/features/api/README.md` - Detailed usage guide
- `IMPLEMENTATION_SUMMARY.md` - What was implemented

Happy coding! 🎉
