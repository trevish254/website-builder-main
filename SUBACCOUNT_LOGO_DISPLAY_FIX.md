# Subaccount Logo Display Fix

## Issue Fixed ✅
The sidebar was not displaying subaccount logos when viewing subaccount pages. It would always show the agency logo regardless of whether you were in an agency or subaccount context.

## Root Cause
The sidebar logic was checking `isWhiteLabeledAgency` to determine whether to show subaccount logos. This meant:
- If `whiteLabel = true`: Always showed agency logo
- If `whiteLabel = false`: Would show subaccount logo

This was incorrect behavior - the logo should always depend on the context (agency vs subaccount), not the white label setting.

## Solution
Updated the logo selection logic in `src/components/sidebar/index.tsx` to:
1. **For subaccounts**: Always show subaccount logo if it exists, fallback to agency logo, then to default logo
2. **For agencies**: Always show agency logo, fallback to default logo

### Changes Made

**File**: `src/components/sidebar/index.tsx`

**Before:**
```typescript
const isWhiteLabeledAgency = user.Agency.whiteLabel
if (!details) return

sideBarLogo = user.Agency.agencyLogo || '/assets/plura-logo.svg'

if (!isWhiteLabeledAgency) {
  if (type === 'subaccount') {
    sideBarLogo =
      user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)
        ?.subAccountLogo || user.Agency.agencyLogo
  }
}
```

**After:**
```typescript
// Determine which logo to show
if (type === 'subaccount') {
  // For subaccounts, show subaccount logo if it exists, otherwise fall back to agency logo
  const subaccount = user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)
  sideBarLogo = subaccount?.subAccountLogo || user.Agency.agencyLogo || '/assets/plura-logo.svg'
  console.log('🔍 Subaccount logo:', subaccount?.subAccountLogo)
  console.log('🔍 Agency logo fallback:', user.Agency.agencyLogo)
  console.log('🔍 Final sidebar logo:', sideBarLogo)
} else {
  // For agency, show agency logo
  sideBarLogo = user.Agency.agencyLogo || '/assets/plura-logo.svg'
}
```

## How It Works Now

### Logo Display Priority

#### For Subaccounts:
1. **Subaccount logo** (if exists)
2. **Agency logo** (fallback)
3. **Default logo** (`/assets/plura-logo.svg`)

#### For Agencies:
1. **Agency logo** (if exists)
2. **Default logo** (`/assets/plura-logo.svg`)

## Uploading Subaccount Logos

Users can upload subaccount logos in the settings page:

1. **Navigate to Subaccount Settings**:
   - Go to any subaccount
   - Click "Settings" in the sidebar
   - Or go to `/subaccount/[subaccountId]/settings`

2. **Upload Logo**:
   - Scroll to "Account Logo" section
   - Click to upload an image
   - Select an image file (max 4MB)
   - Wait for upload to complete

3. **Save Settings**:
   - Fill in other required fields (name, email, phone, address, etc.)
   - Click "Save Account Information"
   - Page will refresh

4. **Logo Appears**:
   - Logo will appear in the sidebar immediately
   - Logo will be used throughout the subaccount context

## Console Logging

The fix includes helpful console logs to debug logo selection:

```
🔍 Subaccount logo: https://utfs.io/f/...
🔍 Agency logo fallback: /placeholder-logo.png
🔍 Final sidebar logo: https://utfs.io/f/...
```

## Benefits

1. ✅ **Context-Aware**: Shows the correct logo based on whether you're in an agency or subaccount
2. ✅ **Fallback Chain**: Always has a logo to display (subaccount → agency → default)
3. ✅ **Simplified Logic**: No longer depends on white label settings
4. ✅ **Better UX**: Users see their subaccount branding when working in subaccounts
5. ✅ **Consistent**: Matches expected behavior from other SaaS platforms

## Testing

### Test Case 1: Subaccount with Logo
1. Go to a subaccount
2. Upload a logo in settings
3. Verify sidebar shows subaccount logo
4. Navigate to different subaccount pages
5. Verify logo persists throughout subaccount

### Test Case 2: Subaccount without Logo
1. Go to a subaccount without an uploaded logo
2. Verify sidebar shows agency logo as fallback
3. Verify logo remains consistent throughout subaccount

### Test Case 3: Agency Context
1. Go to agency dashboard
2. Verify sidebar shows agency logo
3. Upload a new agency logo
4. Verify sidebar updates to show new logo

### Test Case 4: Subaccount Logo Priority
1. Have agency with logo
2. Create subaccount with logo
3. Verify subaccount pages show subaccount logo
4. Verify agency pages show agency logo

## Related Files

- `src/components/sidebar/index.tsx` - Logo selection logic
- `src/components/forms/subaccount-details.tsx` - Subaccount logo upload form
- `src/components/forms/agency-details.tsx` - Agency logo upload form
- `src/app/(main)/subaccount/[subaccountId]/settings/page.tsx` - Subaccount settings page

## Future Enhancements

Potential improvements:
- [ ] Add logo preview before saving
- [ ] Add logo cropping/resizing
- [ ] Add logo removal option
- [ ] Support different logo formats
- [ ] Add logo animation/transitions
- [ ] Cache logos for faster loading
