# Custom Hooks

Reusable hooks for authentication and UI state management.

## Hooks

### useRegister
Handles user registration with API integration and navigation.

```tsx
import { useRegister } from "@/hooks";

const registerMutation = useRegister();

// In your form submit
const onSubmit = (values) => {
  registerMutation.mutate({
    name: values.name,
    email: values.email,
    password: values.password,
  });
};

// Check loading state
registerMutation.isPending
```

**Features**:
- Calls registration API
- Shows success/error toasts
- Stores data in sessionStorage
- Navigates to OTP verification

---

### useLogin
Handles user login with API integration and role-based navigation.

```tsx
import { useLogin } from "@/hooks";

const loginMutation = useLogin();

// In your form submit
const onSubmit = (values) => {
  loginMutation.mutate({
    email: values.email,
    password: values.password,
  });
};

// Check loading state
loginMutation.isPending
```

**Features**:
- Calls login API
- Stores auth token and user data
- Shows success/error toasts
- Navigates based on user role (admin/organizer/donor)

---

### usePasswordToggle
Manages password visibility state.

```tsx
import { usePasswordToggle } from "@/hooks";

const { isVisible, toggle, type } = usePasswordToggle();

<Input type={type} />
<button onClick={toggle}>
  {isVisible ? <EyeOff /> : <Eye />}
</button>
```

**Returns**:
- `isVisible`: Boolean state
- `toggle`: Function to toggle visibility
- `type`: "text" or "password"

---

## Usage Example

```tsx
import { useForm } from "react-hook-form";
import { useLogin, usePasswordToggle } from "@/hooks";

export default function LoginPage() {
  const loginMutation = useLogin();
  const password = usePasswordToggle();
  
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    loginMutation.mutate(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("email")} />
      <Input 
        type={password.type}
        {...form.register("password")} 
      />
      <button onClick={password.toggle}>Toggle</button>
      <button 
        type="submit" 
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
```
