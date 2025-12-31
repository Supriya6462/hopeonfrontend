# Authentication Architecture Documentation

## Overview
This document explains the refactored authentication system following professional senior developer practices with clean, maintainable, and reusable code.

## Architecture Principles

### 1. **Separation of Concerns**
- **UI Components**: Pure presentational components
- **Business Logic**: Extracted into custom hooks
- **API Calls**: Centralized in API layer
- **Validation**: Separate schema files using Zod

### 2. **Code Reusability**
- Shared components across all auth pages
- Custom hooks for common functionality
- Consistent styling and behavior

### 3. **Type Safety**
- Full TypeScript support
- Zod schema validation
- Type inference from schemas

---

## Project Structure

```
src/
├── Auth/
│   ├── Login.tsx              # Login page (clean, uses shared components)
│   ├── Register.tsx           # Register page (clean, uses shared components)
│   ├── ForgetPassword.tsx     # (existing)
│   ├── ResetPassword.tsx      # (existing)
│   └── VerifyOtp.tsx          # (existing)
│
├── components/
│   └── auth/
│       ├── AuthLayout.tsx          # Shared layout with hero section
│       ├── AuthFormHeader.tsx      # Reusable form header
│       ├── PasswordInput.tsx       # Password field with toggle
│       ├── LoadingButton.tsx       # Button with loading state
│       └── index.ts                # Barrel export
│
├── hooks/
│   ├── useAuth.ts                  # Authentication logic (login, register)
│   ├── usePasswordToggle.ts        # Password visibility toggle
│   └── index.ts                    # Barrel export
│
├── features/api/
│   └── publicapi/
│       └── public.api.ts           # API endpoints (existing)
│
├── validations/
│   └── auth.schema.ts              # Zod validation schemas (existing)
│
└── types/
    └── auth.types.ts               # TypeScript interfaces (existing)
```

---

## Component Breakdown

### 1. **Custom Hooks** (`src/hooks/`)

#### `useAuth.ts`
**Purpose**: Encapsulates all authentication business logic

**Exports**:
- `useRegister()`: Handles user registration
  - Calls API
  - Shows success/error toasts
  - Stores registration data in sessionStorage
  - Navigates to OTP verification
  
- `useLogin()`: Handles user login
  - Calls API
  - Stores auth token and user data
  - Navigates based on user role (admin/organizer/donor)
  - Shows success/error toasts

**Benefits**:
- Separates business logic from UI
- Reusable across different components
- Easy to test
- Centralized error handling

#### `usePasswordToggle.ts`
**Purpose**: Manages password visibility state

**Returns**:
- `isVisible`: Boolean state
- `toggle`: Function to toggle visibility
- `type`: "text" or "password" for input type

**Benefits**:
- Reusable across all password fields
- Consistent behavior
- Clean component code

---

### 2. **Reusable Components** (`src/components/auth/`)

#### `AuthLayout.tsx`
**Purpose**: Provides consistent layout for all auth pages

**Features**:
- Left side: Hero section with benefits
- Right side: Form container
- Responsive design (hero hidden on mobile)
- Animated floating elements
- Gradient backgrounds

**Benefits**:
- Consistent look across all auth pages
- Single source of truth for layout
- Easy to update globally

#### `AuthFormHeader.tsx`
**Purpose**: Reusable header for auth forms

**Props**:
- `title`: Main heading
- `subtitle`: Description text
- `showMobileHeader`: Toggle mobile-specific header

**Benefits**:
- Consistent headers
- Responsive behavior
- Easy to customize per page

#### `PasswordInput.tsx`
**Purpose**: Password input with visibility toggle

**Features**:
- Lock icon
- Eye/EyeOff toggle button
- Consistent styling
- Uses `usePasswordToggle` hook

**Benefits**:
- Reusable across all password fields
- Consistent UX
- Reduces code duplication

#### `LoadingButton.tsx`
**Purpose**: Submit button with loading state

**Props**:
- `loading`: Boolean for loading state
- `loadingText`: Text to show when loading
- `children`: Button content
- `type`, `disabled`, `className`: Standard props

**Features**:
- Spinner animation
- Disabled state during loading
- Gradient background
- Smooth transitions

**Benefits**:
- Consistent loading UX
- Prevents double submissions
- Reusable across forms

---

## Page Implementation

### **Register.tsx**

**Structure**:
1. Form setup with `react-hook-form` + Zod validation
2. Uses `useRegister()` hook for business logic
3. Wrapped in `AuthLayout` for consistent design
4. Uses reusable components:
   - `AuthFormHeader`
   - `PasswordInput` (2x for password & confirm)
   - `LoadingButton`

**Form Fields**:
- Name (with User icon)
- Email (with Mail icon)
- Password (with visibility toggle)
- Confirm Password (with visibility toggle)

**Features**:
- Real-time validation
- Terms & conditions notice
- Link to login page
- Security notice footer

### **Login.tsx**

**Structure**:
1. Form setup with `react-hook-form` + Zod validation
2. Uses `useLogin()` hook for business logic
3. Wrapped in `AuthLayout` for consistent design
4. Uses reusable components:
   - `AuthFormHeader`
   - `PasswordInput`
   - `LoadingButton`

**Form Fields**:
- Email (with Mail icon)
- Password (with visibility toggle)

**Features**:
- Real-time validation
- Forgot password link
- Link to register page
- Security notice footer

---

## Data Flow

### Registration Flow:
```
1. User fills form → 2. Form validation (Zod) → 3. Submit
                                                    ↓
4. useRegister hook → 5. API call (authAPI.register) → 6. Success
                                                           ↓
7. Store data in sessionStorage → 8. Show toast → 9. Navigate to OTP
```

### Login Flow:
```
1. User fills form → 2. Form validation (Zod) → 3. Submit
                                                    ↓
4. useLogin hook → 5. API call (authAPI.login) → 6. Success
                                                      ↓
7. Store token & user → 8. Show toast → 9. Navigate by role
```

---

## Key Features

### 1. **Type Safety**
- All forms use TypeScript interfaces
- Zod schemas provide runtime validation
- Type inference from schemas using `z.infer<>`

### 2. **Error Handling**
- API errors caught in hooks
- User-friendly toast notifications
- Form validation errors displayed inline

### 3. **Loading States**
- Buttons show loading spinner
- Forms disabled during submission
- Prevents double submissions

### 4. **Responsive Design**
- Mobile-first approach
- Hero section hidden on mobile
- Touch-friendly inputs (h-12)

### 5. **Accessibility**
- Proper ARIA labels
- Keyboard navigation
- Focus states
- Screen reader friendly

### 6. **Security**
- Passwords never logged
- Secure token storage
- HTTPS enforced (in production)
- Enterprise-grade security notice

---

## Benefits of This Architecture

### For Developers:
✅ **Clean Code**: Easy to read and understand
✅ **Maintainable**: Changes in one place affect all pages
✅ **Testable**: Hooks and components can be tested independently
✅ **Scalable**: Easy to add new auth pages
✅ **Type-Safe**: Catch errors at compile time

### For Users:
✅ **Consistent UX**: Same look and feel across pages
✅ **Fast**: Optimized components and minimal re-renders
✅ **Accessible**: Works with screen readers and keyboards
✅ **Responsive**: Works on all devices
✅ **Secure**: Best practices for auth

---

## How to Extend

### Adding a New Auth Page:
1. Create new page in `src/Auth/`
2. Import `AuthLayout` and auth components
3. Create form with `react-hook-form` + Zod
4. Use or create custom hook for business logic
5. Reuse existing components

### Example:
```tsx
import { AuthLayout, AuthFormHeader, LoadingButton } from "@/components/auth";
import { useYourCustomHook } from "@/hooks";

export default function NewAuthPage() {
  const mutation = useYourCustomHook();
  
  return (
    <AuthLayout>
      <AuthFormHeader title="..." subtitle="..." />
      {/* Your form here */}
      <LoadingButton loading={mutation.isPending}>
        Submit
      </LoadingButton>
    </AuthLayout>
  );
}
```

---

## Best Practices Followed

1. ✅ **Single Responsibility**: Each component/hook does one thing
2. ✅ **DRY (Don't Repeat Yourself)**: Shared logic in hooks/components
3. ✅ **Composition over Inheritance**: Small, composable components
4. ✅ **Type Safety**: TypeScript + Zod validation
5. ✅ **Error Handling**: Graceful error messages
6. ✅ **Loading States**: Clear feedback to users
7. ✅ **Accessibility**: WCAG compliant
8. ✅ **Responsive**: Mobile-first design
9. ✅ **Performance**: Optimized re-renders
10. ✅ **Security**: Best practices for auth

---

## Testing Strategy

### Unit Tests:
- Test hooks independently
- Test validation schemas
- Test utility functions

### Integration Tests:
- Test form submission flow
- Test API integration
- Test navigation

### E2E Tests:
- Test complete user journeys
- Test error scenarios
- Test responsive behavior

---

## Future Improvements

1. **Social Auth**: Add Google/Facebook login
2. **2FA**: Two-factor authentication
3. **Remember Me**: Persistent sessions
4. **Password Strength**: Visual indicator
5. **Rate Limiting**: Prevent brute force
6. **Email Verification**: Verify email before login
7. **Session Management**: Handle token expiry
8. **Biometric Auth**: Fingerprint/Face ID

---

## Conclusion

This architecture provides a solid foundation for authentication that is:
- **Professional**: Follows industry best practices
- **Maintainable**: Easy to update and extend
- **Scalable**: Can grow with your application
- **User-Friendly**: Great UX and accessibility
- **Developer-Friendly**: Clean, typed, and well-documented

The separation of concerns, reusable components, and custom hooks make this codebase easy to understand, test, and maintain for any developer joining the project.
