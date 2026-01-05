import { z } from 'zod';

export const handleFileSchema = ({
  t,
  MAX_FILE_SIZE = 5242880, // 5MB
  ACCEPTED_FILE_TYPES = [],
}: {
  name: string;
  t: (key: string, options?: Record<string, string | number>) => string;
  MAX_FILE_SIZE?: number;
  ACCEPTED_FILE_TYPES?: string[];
}) => {
  return z.any().superRefine((val, ctx) => {
    const isFile = typeof File !== 'undefined' && val instanceof File;
    const isString = typeof val === 'string';

    if (isFile) {
      if (val.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.fileSize', { fileSize: MAX_FILE_SIZE / (1024 * 1024) }),
        });
      }

      if (ACCEPTED_FILE_TYPES.length > 0) {
        const fileType = val.type;
        console.log(fileType, 'fileType');
        if (!fileType || !ACCEPTED_FILE_TYPES.includes(fileType)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.fileType', { types: ACCEPTED_FILE_TYPES.join(', ') }),
          });
        }
      }
    } else if (isString) {
      if (!val.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This field is required',
        });
      }
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'This field is required',
      });
    }
  });
};

export const commonFieldSchema = () =>
  z
    .string({ message: 'This field is required' })
    .trim()
    .min(1, { message: 'This field is required' });

export const phoneNumberSchema = () =>
  z
    .string()
    .trim()
    .min(1, { message: 'This field is required' })
    .regex(/^\+?[1-9]\d{7,14}$/, { message: 'Invalid phone number' });

export const emailSchema = () =>
  z
    .string()
    .trim()
    .min(1, { message: 'This field is required' })
    .email({ message: 'Invalid email' })
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Email must be lowercase and valid');

export const postalCodeSchema = () =>
  z
    .string()
    .trim()
    .min(1, { message: 'This field is required' })
    .regex(/^[A-Za-z0-9-\s]{3,10}$/, { message: 'Invalid pin code' });

// export const passwordSchema = () =>
//   z
//     .string()
//     .min(1, { message: 'This field is required' })
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
//       message:
//         'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
//     });

export const passwordSchema = () =>
  z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })

    // Strength rules
    .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
    .regex(/\d/, { message: 'Must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Must contain at least one special character',
    })

    // ❌ Block email-like passwords
    .refine((val) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val), {
      message: 'Password must not be an email address',
    })

    // ❌ Block weird formats like test@.Test
    .refine((val) => !/@\./.test(val), { message: 'Password format is invalid' });

export const mustPositiveNumber = (minNumber = 0, maxNumber = Infinity) =>
  z
    .string({ message: 'This field is required' })
    .min(1, { message: 'This field is required' })
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .gte?.(minNumber, {
          message: `Minimum length is ${minNumber} characters`,
        })
        .lte(maxNumber, {
          message: `Maximum length is ${minNumber} characters`,
        }),
    )
    .transform((value) => value.toString());

export const urlSchema = () =>
  z.string().trim().min(1, { message: 'This field is required' }).url({ message: 'Invalid url' });

export const fileSchema = z.instanceof(File, { message: 'Must be a file upload' });
export const fileArraySchema = z.array(fileSchema).min(1, 'At least one file required');

export const fileValidation = z.object({
  file: z.string().trim().nonempty('File cannot be empty.'),
  fileName: z.string(),
  mimeType: z.string(),
  type: z.string(),
});

// Common file schema for all document fields
export const documentFileSchema = (MAX_FILE_SIZE: number, ALLOWED_EXTENSIONS: string[]) => {
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);

  return z
    .any()
    .refine((val) => val !== null && val !== undefined && val !== '', {
      message: 'This field is required',
    })
    .refine(
      (val) => {
        // ✅ If it's not a File (custom object), skip validation
        if (!(val instanceof File)) return true;

        // ✅ Check file size
        return val.size <= MAX_FILE_SIZE;
      },
      { message: `File size must be less than ${maxSizeMB}MB` },
    )
    .refine(
      (val) => {
        // ✅ Skip validation if not a File
        if (!(val instanceof File)) return true;

        // ✅ Check allowed file types
        return ALLOWED_MIME_TYPES.includes(val.type);
      },
      {
        message: `File must be one of the following formats: ${ALLOWED_EXTENSIONS.join(', ')}`,
      },
    );
};
