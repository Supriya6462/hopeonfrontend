# Admin Feature Module

Professional implementation of admin features with proper separation of concerns.

## Structure

```
admin/
├── components/          # Reusable UI components
│   ├── ApplicationCard.tsx
│   ├── ApplicationFilters.tsx
│   ├── ApplicationDetailsModal.tsx
│   ├── RejectModal.tsx
│   └── index.ts
├── hooks/              # Custom hooks for business logic
│   ├── usemyapplications.ts
│   ├── useallorganizers.ts
│   ├── useApplicationActions.ts
│   ├── useApplicationFilters.ts
│   └── index.ts
└── pages/              # Page components
    ├── Dashboard.tsx
    ├── KycApplicationofOrganizer.tsx
    ├── OrganizerManagement.tsx
    └── index.ts
```

## Features

### KYC Applications Page

**Components:**
- `ApplicationCard` - Displays individual application with actions
- `ApplicationFilters` - Stats cards and search/filter controls
- `ApplicationDetailsModal` - Full application details in modal
- `RejectModal` - Rejection confirmation with reason input

**Hooks:**
- `usemyapplications` - Fetches applications from API
- `useApplicationActions` - Handles approve/reject mutations
- `useApplicationFilters` - Client-side filtering and search logic

**Features:**
- ✅ Real-time stats (Total, Pending, Approved, Rejected)
- ✅ Click-to-filter by status
- ✅ Search by organization name, email, phone, description
- ✅ Approve/Reject actions with confirmation
- ✅ View full details in modal
- ✅ Responsive grid layout
- ✅ Loading and error states
- ✅ Auto-refresh after actions

## Usage

### Importing Components
```typescript
import { ApplicationCard, ApplicationFilters } from "@/features/admin/components";
```

### Importing Hooks
```typescript
import { usemyapplications, useApplicationActions } from "@/features/admin/hooks";
```

## Design Patterns

1. **Separation of Concerns**
   - UI components are pure and reusable
   - Business logic is in custom hooks
   - API calls are centralized

2. **Component Composition**
   - Small, focused components
   - Props-based communication
   - Easy to test and maintain

3. **State Management**
   - React Query for server state
   - Local state for UI interactions
   - Derived state with useMemo

4. **Type Safety**
   - Full TypeScript coverage
   - Proper type imports
   - Interface definitions

## Extending

To add new features:

1. Create new components in `components/`
2. Add business logic hooks in `hooks/`
3. Compose in page components
4. Export from index files
