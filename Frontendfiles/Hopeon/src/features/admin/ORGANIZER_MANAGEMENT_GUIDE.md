# Organizer Management System

Professional implementation of organizer access control with revoke/reinstate functionality.

## Overview

This system provides comprehensive management of organizer accounts with the ability to:
- View all organizers with their status
- Revoke organizer privileges (with reason tracking)
- Reinstate previously revoked organizers
- Filter by status (Active, Revoked, Pending)
- Search across organizer details
- View complete audit trail

## Why Revoke/Reinstate?

### Industry Standards
This feature is **essential** for any platform handling financial transactions or privileged access:

1. **Compliance Requirements**
   - KYC/AML regulations require suspension capabilities
   - GDPR compliance for dispute resolution
   - Financial audit requirements

2. **Risk Management**
   - Quick response to fraud detection
   - Temporary suspension during investigations
   - Graduated enforcement (warning → suspend → ban)

3. **Business Continuity**
   - Reversible actions prevent permanent data loss
   - Customer retention through reinstatement
   - Maintains historical data for audits

4. **Legal Protection**
   - Documented reasons for all actions
   - Admin accountability tracking
   - Complete audit trail

## Features

### Organizer Card Component
- **Status Indicators**: Visual badges for Active/Revoked/Pending
- **Contact Information**: Email, phone, member since
- **Revocation Warning**: Clear alert for revoked accounts
- **Action Buttons**: Context-aware (Revoke for active, Reinstate for revoked)

### Filtering System
- **Stats Dashboard**: Click-to-filter cards showing counts
  - Total Organizers
  - Active (approved & not revoked)
  - Revoked (suspended access)
  - Pending (awaiting approval)
- **Real-time Search**: Search by name, email, or phone
- **Status Filtering**: Filter by active/revoked/pending/all

### Revoke Modal
- **Warning System**: Clear explanation of consequences
- **Required Reason**: Mandatory reason field for compliance
- **Impact Summary**: Lists what happens when revoking:
  - Suspends campaign creation
  - Prevents withdrawals
  - Maintains historical data
  - Can be reversed

### Organizer Details Modal
- **Complete Profile**: All organizer information
- **Status History**: Approval and revocation status
- **Revocation Details**: When, why, and by whom
- **Account Timeline**: Creation and update dates

## Data Flow

```
User Action → Hook (useOrganizerActions) → API Call → React Query Cache Update → UI Refresh
```

### Revoke Flow
1. Admin clicks "Revoke Access"
2. Modal opens with warning and reason input
3. Admin enters reason (required)
4. Confirmation triggers API call
5. Backend updates organizer status
6. React Query invalidates cache
7. UI refreshes with updated status

### Reinstate Flow
1. Admin clicks "Reinstate"
2. Confirmation dialog appears
3. API call restores privileges
4. Cache invalidates
5. UI updates to show active status

## Components

### OrganizerCard.tsx
Displays individual organizer with:
- Status badge (Active/Revoked/Pending)
- Contact information
- Revocation warning (if applicable)
- Action buttons (context-aware)

### OrganizerFilters.tsx
Stats dashboard and search:
- 4 clickable stat cards
- Real-time search input
- Responsive grid layout

### RevokeModal.tsx
Revocation confirmation:
- Warning icon and message
- Impact summary list
- Required reason textarea
- Compliance note
- Cancel/Confirm buttons

### OrganizerDetailsModal.tsx
Full organizer profile:
- Basic information
- Organizer status
- Revocation details (if revoked)
- Account timeline

## Hooks

### useOrganizerActions.ts
Handles mutations:
- `revokeOrganizer(id, reason)` - Revoke with reason
- `reinstateOrganizer(id)` - Restore access
- Loading states: `isRevoking`, `isReinstating`
- Error handling: `revokeError`, `reinstateError`

### useOrganizerFilters.ts
Client-side filtering:
- Status filtering (all/active/revoked/pending)
- Search filtering (name/email/phone)
- Stats calculation
- Memoized for performance

## API Integration

### Revoke Organizer
```typescript
POST /api/organizer/:id/revoke
Body: { revocationReason: string }
```

### Reinstate Organizer
```typescript
PATCH /api/organizer/:id/reinstate
```

## Security Considerations

1. **Admin Only**: All actions require admin role
2. **Reason Required**: Revocations must include reason
3. **Audit Trail**: All actions logged with admin ID
4. **Confirmation Dialogs**: Prevent accidental actions
5. **Reversible**: Can undo mistakes with reinstatement

## Best Practices

### When to Revoke
- Fraudulent activity detected
- Terms of service violations
- Suspicious campaign patterns
- Donor complaints under investigation
- Compliance issues

### When to Reinstate
- Investigation cleared the organizer
- Mistake in original revocation
- Organizer resolved the issue
- Compliance requirements met

### Documentation
Always include clear, specific reasons:
- ✅ "Multiple donor complaints about campaign XYZ, under investigation"
- ✅ "Fraudulent documents detected in KYC verification"
- ❌ "Bad behavior"
- ❌ "Violation"

## Testing Checklist

- [ ] Revoke active organizer with reason
- [ ] Verify revoked status displays correctly
- [ ] Reinstate revoked organizer
- [ ] Verify active status restored
- [ ] Test search functionality
- [ ] Test status filtering
- [ ] Verify stats update correctly
- [ ] Check modal displays all information
- [ ] Test error handling
- [ ] Verify loading states

## Future Enhancements

1. **Email Notifications**: Notify organizers of status changes
2. **Bulk Actions**: Revoke/reinstate multiple organizers
3. **Advanced Filters**: Date range, revoked by admin
4. **Export**: Download organizer list as CSV
5. **Activity Log**: View all admin actions on organizer
6. **Temporary Suspension**: Auto-reinstate after X days
7. **Warning System**: Send warnings before revocation

## Compliance Notes

This system helps meet regulatory requirements:
- **SOC 2**: Access control and audit logging
- **PCI DSS**: Ability to suspend merchant access
- **GDPR**: Right to restrict processing
- **Financial Regulations**: KYC/AML compliance tools

## Support

For questions or issues:
1. Check this documentation
2. Review API documentation
3. Check backend logs for errors
4. Verify admin permissions
