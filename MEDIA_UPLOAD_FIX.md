# Media Upload and Display Fix

## Issues Fixed ✅

### 1. Wrong API Endpoint
**Problem**: The upload form was using `apiEndpoint="subaccountLogo"` instead of `apiEndpoint="media"`

**Solution**: Changed the endpoint to `"media"` which matches the UploadThing router configuration

### 2. Missing ID Generation
**Problem**: When creating media in the database, the `id` field was null, causing a constraint violation error:
```
null value in column "id" of relation "Media" violates not-null constraint
```

**Solution**: Added ID generation using `v4()` in the `createMedia` function

### 3. Incorrect Data Type
**Problem**: The `CreateMediaType` type was missing the `link` field which is required by the Media table

**Solution**: Updated the type to include all required fields:
```typescript
export type CreateMediaType = {
  name: string
  link: string        // ADDED
  type?: string | null
  subaccountId?: string
  createdAt?: string
  updatedAt?: string
}
```

## Files Modified

### 1. `src/components/forms/upload-media.tsx`
- Changed `apiEndpoint` from `"subaccountLogo"` to `"media"`
- Added better error handling and logging
- Added form reset after successful upload
- Improved toast messages

### 2. `src/lib/queries.ts` - `createMedia` function
- Added ID generation using `v4()`
- Added proper data structure with all required fields
- Added console logging for debugging
- Added try-catch error handling

### 3. `src/lib/types.ts` - `CreateMediaType`
- Added `link` field (required)
- Added `type` field (optional)
- Fixed field names to match database schema

## Media Table Schema

The Media table requires these fields:
- `id`: string (required) - Now generated with `v4()`
- `name`: string (required)
- `link`: string (required) - URL to the uploaded file
- `type`: string | null (optional) - File type
- `subAccountId`: string (required)
- `createdAt`: string (auto-generated)
- `updatedAt`: string (auto-generated)

## How It Works Now

### Upload Flow:
1. User selects a file in the media upload form
2. FileUpload component uploads to UploadThing using `apiEndpoint="media"`
3. UploadThing processes the file and returns a URL
4. URL is set in the form field
5. User enters a name and clicks "Upload Media"
6. `createMedia` function:
   - Generates a unique ID with `v4()`
   - Creates media data object with all required fields
   - Inserts into the Media table
   - Returns the created media record
7. Success notification is shown
8. Form resets
9. Page refreshes to show new media

### Display Flow:
1. Media page fetches all media for the subaccount
2. Media items are displayed in cards
3. Each card shows the media image
4. Users can view/delete media

## Console Logging

The fix includes helpful console logs for debugging:

```
📤 Uploading media: { name: "image.jpg", link: "https://..." }
📤 Creating media with data: { id: "...", name: "...", link: "..." }
✅ Media created successfully: { id: "...", name: "...", ... }
```

## Testing

### Test Case 1: Upload Single Image
1. Go to subaccount → Media
2. Click upload button
3. Select an image file
4. Enter a name (e.g., "Profile Picture")
5. Click "Upload Media"
6. Verify success toast appears
7. Verify image appears in media gallery

### Test Case 2: Upload Multiple Images
1. Upload first image
2. Upload second image
3. Verify both appear
4. Verify they have different IDs

### Test Case 3: Error Handling
1. Try uploading without file
2. Verify error message
3. Try uploading without name
4. Verify validation error

## Error Messages

### Before Fix:
```
Error creating media: {
  code: '23502',
  message: 'null value in column "id" of relation "Media" violates not-null constraint'
}
```

### After Fix:
```
✅ Media created successfully: {
  id: 'generated-uuid',
  name: 'image.jpg',
  link: 'https://utfs.io/f/...',
  type: null,
  subAccountId: 'subaccount-id',
  createdAt: '2025-10-27T...',
  updatedAt: '2025-10-27T...'
}
```

## UploadThing Router Configuration

The `apiEndpoint="media"` maps to the following in `src/app/api/uploadthing/core.ts`:

```typescript
media: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
  .middleware(authenticateUser)
  .onUploadComplete(async ({ metadata, file }) => {
    console.log('✅ Media uploaded:', file.url)
  }),
```

## Benefits

1. ✅ **Proper Upload Endpoint**: Uses correct UploadThing endpoint
2. ✅ **ID Generation**: Automatically generates unique IDs for each media item
3. ✅ **Type Safety**: Updated types match database schema
4. ✅ **Better Error Handling**: Clear error messages and logging
5. ✅ **User Feedback**: Toast notifications for success/failure
6. ✅ **Form Reset**: Form clears after successful upload

## Troubleshooting

### Media Not Uploading
1. Check browser console for errors
2. Verify UploadThing is configured
3. Check file size (max 4MB)
4. Verify you're authenticated (Clerk)

### Media Not Displaying
1. Check database for media records
2. Verify `subAccountId` is correct
3. Check browser console for fetch errors
4. Verify image URLs are accessible

### Upload Success but Not Saved
1. Check console for ID generation
2. Verify all required fields are present
3. Check database constraints
4. Review error logs

## Related Files

- `src/components/forms/upload-media.tsx` - Upload form
- `src/lib/queries.ts` - Database queries
- `src/lib/types.ts` - Type definitions
- `src/app/api/uploadthing/core.ts` - UploadThing router
- `src/components/global/file-upload.tsx` - File upload component
