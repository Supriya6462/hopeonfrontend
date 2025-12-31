# Authentication Flow Diagrams

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Auth Pages Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Register.tsx│  │   Login.tsx  │  │  Other Auth  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  Reusable Components Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  AuthLayout  │  │PasswordInput │  │LoadingButton │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐                                           │
│  │AuthFormHeader│                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     Custom Hooks Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  useRegister │  │   useLogin   │  │usePasswordToggle│   │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
│         │                  │                                 │
└─────────┼──────────────────┼─────────────────────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                       API Layer                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │              authAPI (public.api.ts)             │       │
│  │  • register()  • login()  • requestOtp()         │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
│                   /api/auth/register                         │
│                   /api/auth/login                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Registration Flow

```
┌─────────────┐
│    User     │
│ Fills Form  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         Register.tsx                    │
│  • Form validation (Zod)                │
│  • react-hook-form                      │
└──────┬──────────────────────────────────┘
       │ onSubmit(values)
       ▼
┌─────────────────────────────────────────┐
│      useRegister() Hook                 │
│  • mutation.mutate(data)                │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│      authAPI.register()                 │
│  • POST /api/auth/register              │
└──────┬──────────────────────────────────┘
       │
       ├─── Success ───┐
       │               │
       │               ▼
       │        ┌─────────────────────────┐
       │        │  • Show success toast   │
       │        │  • Store data in        │
       │        │    sessionStorage       │
       │        │  • Navigate to OTP page │
       │        └─────────────────────────┘
       │
       └─── Error ────┐
                      │
                      ▼
               ┌─────────────────────────┐
               │  • Show error toast     │
               │  • Display error message│
               └─────────────────────────┘
```

---

## Login Flow

```
┌─────────────┐
│    User     │
│ Fills Form  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│           Login.tsx                     │
│  • Form validation (Zod)                │
│  • react-hook-form                      │
└──────┬──────────────────────────────────┘
       │ onSubmit(values)
       ▼
┌─────────────────────────────────────────┐
│        useLogin() Hook                  │
│  • mutation.mutate(data)                │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│        authAPI.login()                  │
│  • POST /api/auth/login                 │
└──────┬──────────────────────────────────┘
       │
       ├─── Success ───┐
       │               │
       │               ▼
       │        ┌─────────────────────────┐
       │        │  • Show success toast   │
       │        │  • Store token & user   │
       │        │  • Check user role      │
       │        └──────┬──────────────────┘
       │               │
       │               ├─ Admin ──────► /admin/dashboard
       │               │
       │               ├─ Organizer ──► /organizer/dashboard
       │               │
       │               └─ Donor ──────► /
       │
       └─── Error ────┐
                      │
                      ▼
               ┌─────────────────────────┐
               │  • Show error toast     │
               │  • Display error message│
               └─────────────────────────┘
```

---

## Component Interaction Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Register.tsx                          │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │              AuthLayout                        │    │
│  │  ┌──────────────────────────────────────────┐ │    │
│  │  │        AuthFormHeader                    │ │    │
│  │  │  • Title: "Create Account"               │ │    │
│  │  │  • Subtitle: "Join our community..."     │ │    │
│  │  └──────────────────────────────────────────┘ │    │
│  │                                                │    │
│  │  ┌──────────────────────────────────────────┐ │    │
│  │  │            Card                          │ │    │
│  │  │  ┌────────────────────────────────────┐ │ │    │
│  │  │  │         Form                       │ │ │    │
│  │  │  │  • Name Input                      │ │ │    │
│  │  │  │  • Email Input                     │ │ │    │
│  │  │  │  • PasswordInput (password)        │ │ │    │
│  │  │  │  • PasswordInput (confirm)         │ │ │    │
│  │  │  │  • Terms Notice                    │ │ │    │
│  │  │  │  • LoadingButton                   │ │ │    │
│  │  │  │  • Login Link                      │ │ │    │
│  │  │  └────────────────────────────────────┘ │ │    │
│  │  └──────────────────────────────────────────┘ │    │
│  │                                                │    │
│  │  ┌──────────────────────────────────────────┐ │    │
│  │  │        Security Notice                   │ │    │
│  │  └──────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow in Components

```
┌─────────────────────────────────────────────────────────┐
│                  PasswordInput                          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  usePasswordToggle()                             │  │
│  │  • isVisible: false                              │  │
│  │  • toggle: () => setIsVisible(!isVisible)       │  │
│  │  • type: "password"                              │  │
│  └──────────────────────────────────────────────────┘  │
│                      │                                  │
│                      ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  <Input type={type} />                           │  │
│  │  <button onClick={toggle}>                       │  │
│  │    {isVisible ? <EyeOff /> : <Eye />}            │  │
│  │  </button>                                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  LoadingButton                          │
│                                                         │
│  Props:                                                 │
│  • loading: mutation.isPending                         │
│  • loadingText: "Creating account..."                  │
│  • children: "Create Account"                          │
│                                                         │
│  Renders:                                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  {loading ? (                                    │  │
│  │    <Loader2 /> + loadingText                     │  │
│  │  ) : (                                           │  │
│  │    children                                      │  │
│  │  )}                                              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Form State                           │
│  (Managed by react-hook-form)                          │
│                                                         │
│  • name: ""                                             │
│  • email: ""                                            │
│  • password: ""                                         │
│  • confirmPassword: ""                                  │
│                                                         │
│  Validation: Zod Schema                                 │
│  • Real-time validation                                 │
│  • Error messages                                       │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  Mutation State                         │
│  (Managed by @tanstack/react-query)                    │
│                                                         │
│  • isPending: false                                     │
│  • isError: false                                       │
│  • isSuccess: false                                     │
│  • data: null                                           │
│  • error: null                                          │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  UI State                               │
│                                                         │
│  • Button disabled: isPending                           │
│  • Show spinner: isPending                              │
│  • Show errors: isError                                 │
│  • Navigate: isSuccess                                  │
└─────────────────────────────────────────────────────────┘
```

---

## Reusability Pattern

```
┌─────────────────────────────────────────────────────────┐
│              Shared Components                          │
│                                                         │
│  AuthLayout ──────────┐                                │
│  AuthFormHeader ──────┤                                │
│  PasswordInput ───────┼──► Used by:                    │
│  LoadingButton ───────┤    • Register.tsx              │
│                       │    • Login.tsx                 │
│                       │    • ForgetPassword.tsx        │
│                       │    • ResetPassword.tsx         │
│                       └──► • Any future auth pages     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                Custom Hooks                             │
│                                                         │
│  useRegister ─────────┐                                │
│  useLogin ────────────┼──► Used by:                    │
│  usePasswordToggle ───┤    • Auth pages                │
│                       │    • Any component needing     │
│                       └──►   authentication            │
└─────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Error Sources                          │
│                                                         │
│  1. Form Validation (Zod)                              │
│     • Invalid email format                              │
│     • Password too short                                │
│     • Passwords don't match                             │
│     └──► Display inline under field                    │
│                                                         │
│  2. API Errors                                          │
│     • Network error                                     │
│     • Server error                                      │
│     • Validation error                                  │
│     └──► Show toast notification                       │
│                                                         │
│  3. Runtime Errors                                      │
│     • Storage errors                                    │
│     • Navigation errors                                 │
│     └──► Console.error + fallback                      │
└─────────────────────────────────────────────────────────┘
```

This visual representation helps understand how all the pieces fit together!
