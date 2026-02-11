import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const newPanCardSchema = z.object({
  serviceType: z.literal('new-pan-card'),

  passportCopy: requiredFileSchema.optional().or(z.literal('')),
  proofOfAddress: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
  birthOrDobProof: requiredFileSchema.optional().or(z.literal('')),
  applicationForm49AA: requiredFileSchema.optional().or(z.literal('')),
});
