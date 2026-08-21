import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wvveitdbktlvigdsxscd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2dmVpdGRia3RsdmlnZHN4c2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNjU5MzksImV4cCI6MjA2Mzg0MTkzOX0.fzLuU71QtxkK4uBfgmoXh1nM24O98Nbb7LriBvtqPps';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload file to Supabase Storage
 * @param file - File to upload
 * @param bucket - Storage bucket name
 * @param path - File path in bucket
 * @returns Promise<string> - Public URL of uploaded file
 */
export const uploadFileToSupabase = async (
  file: File,
  bucket: string = 'ethio-bites',
  path?: string
): Promise<string> => {
  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file');
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  // Generate unique filename
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = path ? `${path}/${fileName}` : fileName;

  try {
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export default supabase;