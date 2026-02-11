// Power of attorney

import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const lifeCertificateSchema = z.object({
  serviceType: z.literal('life-certificate-for-pension-or-verification'),

  medicalExaminationCertificate: requiredFileSchema.optional().or(z.literal('')),
  pensionBookOrBankProof: requiredFileSchema.optional().or(z.literal('')),
  explanationLetter: requiredFileSchema.optional().or(z.literal('')),
  lifeCertificateCopy: requiredFileSchema.optional().or(z.literal('')),
  passportCopy: requiredFileSchema.optional().or(z.literal('')),
});
