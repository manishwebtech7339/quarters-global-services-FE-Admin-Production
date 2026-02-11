import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const passportGlobalSchema = z.object({
  serviceType: z.literal('passport-global'),

  originalPassport: requiredFileSchema.optional().or(z.literal('')),
  passportBioDataPageCopy: requiredFileSchema.optional().or(z.literal('')),
  passportAddressPageCopy: requiredFileSchema.optional().or(z.literal('')),
  passportObservationPagesCopy: requiredFileSchema.optional().or(z.literal('')),
  policeReportOrFir: requiredFileSchema.optional().or(z.literal('')),

  proofOfIdentity: requiredFileSchema.optional().or(z.literal('')),
  proofOfAddress: requiredFileSchema.optional().or(z.literal('')),
  proofOfDateOfBirth: requiredFileSchema.optional().or(z.literal('')),
  nationalityOrCitizenshipProof: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),

  marriageOrDivorceCertificate: requiredFileSchema.optional().or(z.literal('')),
  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),

  minorApplicantDocuments: requiredFileSchema.optional().or(z.literal('')),
  emergencyOrTatkalSupportingDocuments: requiredFileSchema.optional().or(z.literal('')),
});
