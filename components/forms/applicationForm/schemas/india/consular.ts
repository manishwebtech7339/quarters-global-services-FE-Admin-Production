import { z } from 'zod';
import { requiredFileSchema } from '../common';

// =======================================
// RENUNCIATION OF INDIAN CITIZENSHIP
// =======================================

export const renunciationIndianCitizenshipSchema = z.object({
  serviceType: z.literal('renunciation-indian-citizenship'),

  renunciationApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  indianPassportOriginal: requiredFileSchema.optional().or(z.literal('')),
  foreignPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
  photograph: requiredFileSchema.optional().or(z.literal('')),
});

// =======================================
// POLICE CLEARANCE CERTIFICATE (PCC)
// =======================================

export const policeClearanceCertificateSchema = z.object({
  serviceType: z.literal('police-clearance-certificate'),

  pccApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  passportCopy: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  photograph: requiredFileSchema.optional().or(z.literal('')),
});

// =======================================
// GLOBAL ENTRY PROGRAM (GEP)
// =======================================

export const globalEntryProgramSchema = z.object({
  serviceType: z.literal('global-entry-program'),

  gepApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  passportCopy: requiredFileSchema.optional().or(z.literal('')),
  visaCopy: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
});
