# Auth Components

Reusable authentication components for consistent UI across all auth pages.

## Components

### AuthLayout
Provides the split-screen layout with hero section and form container.

```tsx
import { AuthLayout } from "@/components/auth";

<AuthLayout>
  {/* Your form content */}
</AuthLayout>
```

### AuthFormHeader
Displays title and subtitle with responsive behavior.

```tsx
import { AuthFormHeader } from "@/components/auth";

<AuthFormHeader 
  title="Welcome Back"
  subtitle="Sign in to continue"
  showMobileHeader={true}
/>
```

### PasswordInput
Password input field with visibility toggle.

```tsx
import { PasswordInput } from "@/components/auth";

<PasswordInput
  value={field.value}
  onChange={field.onChange}
  onBlur={field.onBlur}
  placeholder="Enter password"
/>
```

### LoadingButton
Submit button with loading state and spinner.

```tsx
import { LoadingButton } from "@/components/auth";

<LoadingButton
  loading={mutation.isPending}
  loadingText="Signing in..."
>
  Sign In
</LoadingButton>
```

## Usage Example

```tsx
import { AuthLayout, AuthFormHeader, PasswordInput, LoadingButton } from "@/components/auth";

export default function MyAuthPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <AuthFormHeader 
          title="My Page"
          subtitle="Description"
        />
        
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <PasswordInput {...field} />
              <LoadingButton loading={isLoading}>
                Submit
              </LoadingButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
```
