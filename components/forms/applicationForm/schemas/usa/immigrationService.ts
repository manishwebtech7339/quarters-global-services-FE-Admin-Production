import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const usCitizenshipN400Schema = z.object({
  serviceType: z.literal('us-citizenship-(naturalization)-form-filing-service'),

  greenCardCopy: requiredFileSchema.optional().or(z.literal('')),
  passportsAllPages: requiredFileSchema.optional().or(z.literal('')),
  stateIdOrDriversLicense: requiredFileSchema.optional().or(z.literal('')),
  socialSecurityCard: requiredFileSchema.optional().or(z.literal('')),

  addressHistory: requiredFileSchema.optional().or(z.literal('')),
  employmentHistory: requiredFileSchema.optional().or(z.literal('')),
  travelHistoryOutsideUs: requiredFileSchema.optional().or(z.literal('')),

  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  divorceOrDeathCertificate: requiredFileSchema.optional().or(z.literal('')),
  spouseCitizenshipProof: requiredFileSchema.optional().or(z.literal('')),
  childrenBirthCertificates: requiredFileSchema.optional().or(z.literal('')),

  selectiveServiceProof: requiredFileSchema.optional().or(z.literal('')),
  taxReturns: requiredFileSchema.optional().or(z.literal('')),
  courtRecords: requiredFileSchema.optional().or(z.literal('')),
  nameChangeDocuments: requiredFileSchema.optional().or(z.literal('')),
});

export const greenCardRenewalReplacementSchema = z.object({
  serviceType: z.literal('green-card-renewal-replacement'),

  greenCardCopy: requiredFileSchema.optional().or(z.literal('')),
  passportBiographicPage: requiredFileSchema.optional().or(z.literal('')),
  stateIdOrDriversLicense: requiredFileSchema.optional().or(z.literal('')),

  policeReport: requiredFileSchema.optional().or(z.literal('')),
  writtenExplanationOfLoss: requiredFileSchema.optional().or(z.literal('')),

  nameChangeOrCourtOrder: requiredFileSchema.optional().or(z.literal('')),

  previousUscisNotices: requiredFileSchema.optional().or(z.literal('')),
  proofOfLprStatus: requiredFileSchema.optional().or(z.literal('')),
});
