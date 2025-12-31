# Routing System Documentation

## Overview
Professional routing setup using React Router v6 with lazy loading, code splitting, and proper TypeScript types.

---

## File Structure

```
src/routes/
├── routes.ts              # Route path constants
├── routesConfig.tsx       # Route configuration with lazy loading
└── README.md             # This file

src/app/router/
└── AppRouter.tsx         # Main router component
```

---

## Routes Configuration

### `routes.ts` - Route Constants
Centralized route paths to avoid hardcoding strings throughout the app.

```typescript
const ROUTES = {
    LOGIN: "/login",
    REGISTER: "/register",
    OTP_VERIFICATION: "/verify-otp",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
};
```

**Benefits:**
- Single source of truth for routes
- Easy to update paths
- TypeScript autocomplete
- Prevents typos

**Usage:**
```typescript
import ROUTES from "@/routes/routes";

// In navigation
navigate(ROUTES.LOGIN);

// In links
<Link to={ROUTES.REGISTER}>Sign Up</Link>
```

---

## Route Types

### 1. Authentication Routes
Public routes for user authentication (login, register, etc.)

```typescript
export const authRoutes: RouteObject[] = [
  { path: ROUTES.LOGIN, element: <LazyRoute Component={Login} /> },
  { path: ROUTES.REGISTER, element: <LazyRoute Component={Register} /> },
  { path: ROUTES.FORGOT_PASSWORD, element: <LazyRoute Component={ForgetPassword} /> },
  { path: ROUTES.OTP_VERIFICATION, element: <LazyRoute Component={VerifyOtp} /> },
  { path: ROUTES.RESET_PASSWORD, element: <LazyRoute Component={ResetPassword} /> },
];
```

### 2. Protected Routes
Routes that require authentication (to be implemented)

```typescript
export const protectedRoutes: RouteObject[] = [
  // Example:
  // {
  //   path: "/dashboard",
  //   element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  // },
];
```

### 3. Public Routes
Routes accessible to everyone (to be implemented)

```typescript
export const publicRoutes: RouteObject[] = [
  // Example:
  // {
  //   path: "/",
  //   element: <Home />,
  // },
];
```

---

## Lazy Loading

### Why Lazy Loading?
- **Faster initial load**: Only load what's needed
- **Code splitting**: Smaller bundle sizes
- **Better performance**: Load routes on demand

### Implementation

```typescript
// Lazy load components
const Login = lazy(() => import("@/Auth/Login"));
const Register = lazy(() => import("@/Auth/Register"));

// Wrapper with Suspense
const LazyRoute = ({ Component }: { Component: ComponentType }) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

// Use in routes
{
  path: ROUTES.LOGIN,
  element: <LazyRoute Component={Login} />,
}
```

### Loading Fallback
Custom loading component shown while lazy components load:

```typescript
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
);
```

---

## Router Setup

### `AppRouter.tsx`
Main router component that provides routing to the entire app.

```typescript
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routesConfig from "@/routes/routesConfig";

const router = createBrowserRouter(routesConfig);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
```

### Integration in `App.tsx`

```typescript
import AppRouter from "@/app/router/AppRouter";

const App = () => {
  return <AppRouter />;
};
```

---

## Adding New Routes

### Step 1: Add Route Constant
```typescript
// routes.ts
const ROUTES = {
  // ... existing routes
  NEW_PAGE: "/new-page",
};
```

### Step 2: Create Component
```typescript
// src/pages/NewPage.tsx
export default function NewPage() {
  return <div>New Page</div>;
}
```

### Step 3: Add to Route Config
```typescript
// routesConfig.tsx
const NewPage = lazy(() => import("@/pages/NewPage"));

// Add to appropriate array
export const publicRoutes: RouteObject[] = [
  {
    path: ROUTES.NEW_PAGE,
    element: <LazyRoute Component={NewPage} />,
  },
];
```

---

## Protected Routes (Future Implementation)

### Create ProtectedRoute Component

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import ROUTES from "@/routes/routes";

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return children;
};
```

### Use in Routes

```typescript
{
  path: "/dashboard",
  element: (
    <ProtectedRoute>
      <LazyRoute Component={Dashboard} />
    </ProtectedRoute>
  ),
}
```

---

## Role-Based Routes (Future Implementation)

### Create RoleBasedRoute Component

```typescript
// src/components/RoleBasedRoute.tsx
import { Navigate } from "react-router-dom";
import ROUTES from "@/routes/routes";

export const RoleBasedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return children;
};
```

### Use in Routes

```typescript
{
  path: "/admin/dashboard",
  element: (
    <RoleBasedRoute allowedRoles={["admin"]}>
      <LazyRoute Component={AdminDashboard} />
    </RoleBasedRoute>
  ),
}
```

---

## 404 Not Found

Catch-all route for undefined paths:

```typescript
{
  path: "*",
  element: (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl">Page not found</p>
        <a href={ROUTES.LOGIN}>Go to Login</a>
      </div>
    </div>
  ),
}
```

---

## Navigation

### Programmatic Navigation

```typescript
import { useNavigate } from "react-router-dom";
import ROUTES from "@/routes/routes";

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(ROUTES.LOGIN);
    // or with replace
    navigate(ROUTES.LOGIN, { replace: true });
  };
};
```

### Link Navigation

```typescript
import { Link } from "react-router-dom";
import ROUTES from "@/routes/routes";

<Link to={ROUTES.REGISTER}>Sign Up</Link>
```

### NavLink (with active state)

```typescript
import { NavLink } from "react-router-dom";
import ROUTES from "@/routes/routes";

<NavLink 
  to={ROUTES.LOGIN}
  className={({ isActive }) => isActive ? "active" : ""}
>
  Login
</NavLink>
```

---

## Best Practices

### ✅ DO:
- Use route constants from `routes.ts`
- Lazy load all route components
- Provide loading fallbacks
- Use TypeScript types
- Group routes by type (auth, protected, public)
- Add 404 catch-all route

### ❌ DON'T:
- Hardcode route paths
- Import all components eagerly
- Forget loading states
- Mix route types
- Skip TypeScript types

---

## Performance Optimization

### Code Splitting
Each lazy-loaded component creates a separate bundle:
```
dist/
├── Login.chunk.js
├── Register.chunk.js
├── Dashboard.chunk.js
└── ...
```

### Preloading
Preload routes on hover for faster navigation:

```typescript
const preloadRoute = (Component: ComponentType) => {
  Component.preload?.();
};

<Link 
  to={ROUTES.DASHBOARD}
  onMouseEnter={() => preloadRoute(Dashboard)}
>
  Dashboard
</Link>
```

---

## Testing

### Test Route Configuration

```typescript
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRouter from "@/app/router/AppRouter";

test("renders login page", () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <AppRouter />
    </MemoryRouter>
  );
  
  expect(screen.getByText("Welcome Back")).toBeInTheDocument();
});
```

---

## Troubleshooting

### Issue: Route not found
**Solution**: Check if route is added to `routesConfig.tsx`

### Issue: Component not loading
**Solution**: Verify lazy import path is correct

### Issue: TypeScript errors
**Solution**: Use `type` imports for types: `import type { RouteObject }`

### Issue: Infinite redirect
**Solution**: Check protected route logic and authentication state

---

## Future Enhancements

1. **Nested Routes**: Add layout routes with nested children
2. **Route Guards**: Implement authentication and authorization
3. **Route Transitions**: Add page transition animations
4. **Breadcrumbs**: Auto-generate breadcrumbs from routes
5. **Route Metadata**: Add titles, descriptions, and meta tags
6. **Error Boundaries**: Catch and handle route errors gracefully

---

## Summary

This routing system provides:
- ✅ Clean, maintainable route configuration
- ✅ Lazy loading for better performance
- ✅ TypeScript type safety
- ✅ Easy to extend and modify
- ✅ Professional structure
- ✅ Best practices followed

All routes are now properly configured and ready to use!
