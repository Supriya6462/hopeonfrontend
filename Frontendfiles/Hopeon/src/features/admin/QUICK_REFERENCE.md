# Admin Features - Quick Reference

## Pages

### KYC Applications (`/admin/applications`)
Review and approve/reject organizer applications

**Actions:**
- ✅ Approve application
- ❌ Reject with reason
- 👁️ View full details

### Organizer Management (`/admin/organizers`)
Manage organizer access and privileges

**Actions:**
- 🚫 Revoke access (with reason)
- ✅ Reinstate access
- 👁️ View full profile

## Components Quick Import

```typescript
// Application components
import {
  ApplicationCard,
  ApplicationFilters,
  ApplicationDetailsModal,
  RejectModal,
} from "@/features/admin/components";

// Organizer components
import {
  OrganizerCard,
  OrganizerFilters,
  OrganizerDetailsModal,
  RevokeModal,
} from "@/features/admin/components";
```

## Hooks Quick Import

```typescript
// Application hooks
import {
  usemyapplications,
  useApplicationActions,
  useApplicationFilters,
} from "@/features/admin/hooks";

// Organizer hooks
import {
  useallorganizers,
  useOrganizerActions,
  useOrganizerFilters,
} from "@/features/admin/hooks";
```

## Common Patterns

### Basic Page Structure
```typescript
export default function MyAdminPage() {
  // 1. Fetch data
  const { data, isLoading, isError, error } = useMyData();
  
  // 2. Actions
  const { performAction } = useMyActions();
  
  // 3. Filters
  const { filteredData, stats } = useMyFilters(data);
  
  // 4. Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 5. Handlers
  const handleAction = (id: string) => {
    performAction(id);
  };
  
  // 6. Loading/Error states
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  
  // 7. Render
  return <YourUI />;
}
```

### Filter Hook Pattern
```typescript
const {
  statusFilter,      // Current filter
  setStatusFilter,   // Update filter
  searchQuery,       // Current search
  setSearchQuery,    // Update search
  stats,            // Calculated stats
  filteredData,     // Filtered results
} = useMyFilters(rawData);
```

### Action Hook Pattern
```typescript
const {
  performAction,    // Mutation function
  isPerforming,     // Loading state
  actionError,      // Error state
} = useMyActions();
```

## Status Indicators

### Application Status
- 🟡 **Pending**: Awaiting review
- 🟢 **Approved**: Application accepted
- 🔴 **Rejected**: Application denied

### Organizer Status
- 🟢 **Active**: Full access (approved & not revoked)
- 🔴 **Revoked**: Access suspended
- 🟡 **Pending**: Awaiting approval

## API Endpoints

### Applications
- `GET /api/organizer/applications` - List all
- `GET /api/organizer/applications/:id` - Get one
- `PATCH /api/organizer/applications/:id/approve` - Approve
- `PATCH /api/organizer/applications/:id/reject` - Reject

### Organizers
- `GET /api/organizer` - List all
- `PATCH /api/organizer/:id/revoke` - Revoke
- `PATCH /api/organizer/:id/reinstate` - Reinstate

## Color Scheme

### Status Colors
```css
Pending:  bg-amber-50 border-amber-200 text-amber-700
Approved: bg-emerald-50 border-emerald-200 text-emerald-700
Rejected: bg-rose-50 border-rose-200 text-rose-700
Active:   bg-emerald-50 border-emerald-200 text-emerald-700
Revoked:  bg-rose-50 border-rose-200 text-rose-700
```

## Troubleshooting

### Data not showing?
1. Check API response structure: `data?.data?.items` vs `data?.items`
2. Check console for errors
3. Verify backend is running
4. Check network tab for API calls

### Actions not working?
1. Check React Query cache invalidation
2. Verify API endpoint is correct
3. Check for error messages
4. Verify admin permissions

### Filters not working?
1. Check filter logic in hook
2. Verify data structure
3. Check search query trimming
4. Test with console.log

## Best Practices

### ✅ Do
- Use TypeScript types
- Handle loading/error states
- Add confirmation dialogs
- Provide clear error messages
- Include mandatory reasons for actions
- Invalidate cache after mutations
- Use memoization for expensive calculations

### ❌ Don't
- Mutate state directly
- Skip error handling
- Forget loading states
- Allow actions without confirmation
- Skip reason fields for revoke/reject
- Forget to invalidate cache
- Put business logic in components

## Need Help?

1. Check `README.md` for module overview
2. Check `ORGANIZER_MANAGEMENT_GUIDE.md` for detailed guide
3. Check `IMPLEMENTATION_SUMMARY.md` for architecture
4. Check component/hook source code (well documented)
5. Check API documentation
