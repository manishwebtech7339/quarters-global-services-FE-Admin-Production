import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const passportUKRenewalSchema = z.object({
  serviceType: z.literal('passport-renewal'),

  originalUkPassport: requiredFileSchema.optional().or(z.literal('')),
  digitalPassportPhoto: requiredFileSchema.optional().or(z.literal('')),
  legalStatusProof: requiredFileSchema.optional().or(z.literal('')),
  usAddressProof: requiredFileSchema.optional().or(z.literal('')),
  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),
  childPassportSupportingDocuments: requiredFileSchema.optional().or(z.literal('')),
  additionalDocumentsRequested: requiredFileSchema.optional().or(z.literal('')),
});
