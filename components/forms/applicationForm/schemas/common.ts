import { z } from 'zod';

// ---- Common Schemas and Types ----

// File upload schema with size limit
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const requiredFileSchema = z
  .any()
  .refine(
    (file) => {
      console.log(file, 'file');
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

// ---- Service types ----
export const serviceTypes = {
  empty: 'empty',
  // USA Visa Types
  'b1b2-visitor-visa': 'b1b2-visitor-visa',
  'f1-student-visa': 'f1-student-visa',
  'j1-exchange-visitor-visa': 'j1-exchange-visitor-visa',
  'h1b-business-visa': 'h1b-business-visa',
  'h2a-h2b-temporary-worker-visa': 'h2a-h2b-temporary-worker-visa',
  'l1-intra-company-transfer': 'l1-intra-company-transfer',
  'o1-extraordinary-ability': 'o1-extraordinary-ability',
  'p1-p3-athlete-artist-visa': 'p1-p3-athlete-artist-visa',
  'r1-religious-worker-visa': 'r1-religious-worker-visa',
  'tn-td-nafta-visa': 'tn-td-nafta-visa',
  'ir-immediate-relative-visa': 'ir-immediate-relative-visa',
  'f1-f4-family-preference-visa': 'f1-f4-family-preference-visa',
  'eb1-eb5-employment-based-visa': 'eb1-eb5-employment-based-visa',
  'dv-diversity-lottery-visa': 'dv-diversity-lottery-visa',
  'k1-fiance-visa': 'k1-fiance-visa',
  'k3-spouse-visa': 'k3-spouse-visa',
  's-witness-informant-visa': 's-witness-informant-visa',
  't-trafficking-victims-visa': 't-trafficking-victims-visa',
  'u-crime-victims-visa': 'u-crime-victims-visa',
  // India Visa Types
  'tourist-visa': 'tourist-visa',
  'business-visa': 'business-visa',
  'student-visa': 'student-visa',
  'medical-visa': 'medical-visa',
  'conference-visa': 'conference-visa',
  'employment-visa': 'employment-visa',
  // USA Passport Types
  'new-passport': 'new-passport',
  'usa-passport-renewal': 'renewal',
  'child-passport': 'child-passport',
  'damaged-passport': 'damaged-passport',
  'stolen-passport': 'stolen-passport',
  'lost-passport': 'lost-passport',
  'usa-passport-card': 'usa-passport-card',
  'name-change': 'name-change',
  'second-passport': 'second-passport',
  'expedited-passport-service': 'expedited-passport-service',
  'emergency-or-same-day-passport': 'emergency-or-same-day-passport',
  // India Passport Types
  'india-passport-new-adult': 'india-passport-new-adult',
  'india-passport-new-minor': 'india-passport-new-minor',
  'adult-renewal': 'adult-renewal',
  'minor-renewal': 'minor-renewal',
  'lost-passport-1': 'lost-passport-1',
  'tatkal-passport': 'tatkal-passport',
  'india-passport-name-change': 'india-passport-name-change',
} as const;

export type ServiceType = (typeof serviceTypes)[keyof typeof serviceTypes];

export const emptySchema = z.object({
  serviceType: z.literal(serviceTypes['empty']),
});
