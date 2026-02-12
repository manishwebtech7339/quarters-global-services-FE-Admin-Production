import { z } from 'zod';

// ---- Common Schemas and Types ----

// File upload schema with size limit
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const requiredFileSchema = z
  .any()
  .refine(
    (file) => {
      if (!file) return false;

      if (file instanceof File && file.size <= MAX_FILE_SIZE) return true;

      return true;
    },
    { message: 'File is required or must be a valid upload (≤ 5MB)' },
  )
  .refine(
    (file) => {
      if (file instanceof File) return file.size <= MAX_FILE_SIZE;
      return true; // Skip if not a File
    },
    { message: 'Uploaded file must be ≤ 5MB' },
  )
  .describe('file');
