import { z } from 'zod';
import { requiredFileSchema, serviceTypes } from '../common';

// ---- INDIA PASSPORT SCHEMAS ----

// India New Passport – Adult
export const passportIndiaNewAdultSchema = z.object({
  serviceType: z.literal(serviceTypes['india-passport-new-adult']),
  proofOfAddress: requiredFileSchema,
  birthCertificate: requiredFileSchema,
  aadhaarCard: requiredFileSchema,
  identityProof: requiredFileSchema,
  passportPhotos: requiredFileSchema,
  applicationForm: requiredFileSchema,
});

// India New Passport – Minor
export const passportIndiaNewMinorSchema = z.object({
  serviceType: z.literal(serviceTypes['india-passport-new-minor']),
  parentsPassportCopies: requiredFileSchema,
  birthCertificate: requiredFileSchema,
  proofOfAddress: requiredFileSchema,
  photos: requiredFileSchema,
  applicationForm: requiredFileSchema,
});

// India Passport Renewal – Adult
export const passportIndiaRenewalAdultSchema = z.object({
  serviceType: z.literal(serviceTypes['adult-renewal']),
  oldPassport: requiredFileSchema,
  proofOfAddress: requiredFileSchema,
  applicationForm: requiredFileSchema,
  passportPhotos: requiredFileSchema,
});

// India Passport Renewal – Minor
export const passportIndiaRenewalMinorSchema = z.object({
  serviceType: z.literal(serviceTypes['minor-renewal']),
  oldPassportMinor: requiredFileSchema,
  parentsIds: requiredFileSchema,
  proofOfAddress: requiredFileSchema,
  photos: requiredFileSchema,
  applicationForm: requiredFileSchema,
});

// India Lost/Damaged Passport
export const passportIndiaLostDamagedSchema = z.object({
  serviceType: z.literal(serviceTypes['lost-passport-1']),
  policeReport: requiredFileSchema,
  oldPassportCopy: requiredFileSchema.optional(),
  proofOfAddress: requiredFileSchema,
  photos: requiredFileSchema,
  applicationForm: requiredFileSchema,
});

// India Tatkal Passport
export const passportIndiaTatkalSchema = z.object({
  serviceType: z.literal(serviceTypes['tatkal-passport']),
  proofOfUrgency: requiredFileSchema,
  aadhaarIdProof: requiredFileSchema,
  policeVerificationDocument: requiredFileSchema,
  applicationForm: requiredFileSchema,
  photos: requiredFileSchema,
});

// India Name Change in Passport
export const passportIndiaNameChangeSchema = z.object({
  serviceType: z.literal(serviceTypes['india-passport-name-change']),
  currentPassport: requiredFileSchema,
  gazetteLegalNameChangeCertificate: requiredFileSchema,
  marriageDivorceCertificate: requiredFileSchema.optional(),
  photos: requiredFileSchema,
});
