# Supabase Integration Setup

This project now uses Supabase for file uploads, consistent with the mobile application architecture.

## Installation

```bash
npm install @supabase/supabase-js
```

## Environment Variables

Add the following to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wvveitdbktlvigdsxscd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Configuration

The Supabase client is configured in `lib/supabase.ts` with:
- File upload utilities
- Validation for image files (max 5MB)
- Automatic path organization for different file types
- Error handling and retry logic

## Usage

### Upload Receipt Images
```typescript
import { uploadReceiptImage } from '@/lib/supabase';

const uploadedUrl = await uploadReceiptImage(file, restaurantId);
```

### Generic File Upload
```typescript
import { uploadFileToSupabase } from '@/lib/supabase';

const uploadedUrl = await uploadFileToSupabase(
  file, 
  'ethio-bites', // bucket
  'custom-path'  // optional path
);
```

## File Organization

Files are organized in the Supabase bucket as:
- `subscription-receipts/{restaurantId}/` - Payment receipts
- `restaurant-images/{restaurantId}/` - Restaurant photos
- `menu-images/{restaurantId}/` - Food and menu images

## Security

- Files are uploaded to the `ethio-bites` bucket
- Public URLs are generated for easy access
- File type validation (images only)
- File size limits (5MB max)
- Unique filename generation to prevent conflicts

## Mobile App Consistency

This implementation matches the mobile app's Supabase configuration:
- Same bucket (`ethio-bites`)
- Same URL structure
- Compatible file paths
- Consistent error handling