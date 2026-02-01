import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const passportIndiaNewAdultSchema = z.object({
  serviceType: z.literal('india-passport-new-adult'),

  proofOfAddress: requiredFileSchema.optional().or(z.literal('')),
  birthCertificate: requiredFileSchema.optional().or(z.literal('')),
  aadhaarCard: requiredFileSchema.optional().or(z.literal('')),
  identityProof: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
  applicationForm: requiredFileSchema.optional().or(z.literal('')),

  policeVerificationDocument: requiredFileSchema.optional().or(z.literal('')),
});

export const passportIndiaNewMinorSchema = z.object({
  serviceType: z.literal('india-passport-new-minor'),

  parentsPassportCopies: requiredFileSchema.optional().or(z.literal('')),
  birthCertificate: requiredFileSchema.optional().or(z.literal('')),
  proofOfAddress: requiredFileSchema.optional().or(z.literal('')),
  photos: requiredFileSchema.optional().or(z.literal('')),
  applicationForm: requiredFileSchema.optional().or(z.literal('')),

  parentsConsentForm: requiredFileSchema.optional().or(z.literal('')),
});

export const passportIndiaRenewalAdultSchema = z.object({
  serviceType: z.literal('adult-renewal'),

  oldPassport: requiredFileSchema.optional().or(z.literal('')),
  proofOfAddress: requiredFileSchema.optional().or(z.literal('')),
  applicationForm: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),

  policeVerificationDocument: requiredFileSchema.optional().or(z.literal('')),
});

export const passportIndiaRenewalMinorSchema = z.object({
  serviceType: z.literal('minor-renewal'),

  oldPassportMinor: requiredFileSchema.optional().or(z.literal('')),
  parentsIds: requiredFileSchema.optional().or(z.literal('')),
  proofOfAddress: requiredFileSchema.optional().or(z.literal('')),
  photos: requiredFileSchema.optional().or(z.literal('')),
  applicationForm: requiredFileSchema.optional().or(z.literal('')),

  parentsConsentForm: requiredFileSchema.optional().or(z.literal('')),
});

export const passportIndiaLostDamagedSchema = z.object({
  serviceType: z.literal('lost-passport-1'),

  policeReport: requiredFileSchema.optional().or(z.literal('')),
  oldPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  proofOfAddress: requiredFileSchema.optional().or(z.literal('')),
  photos: requiredFileSchema.optional().or(z.literal('')),
  applicationForm: requiredFileSchema.optional().or(z.literal('')),

  newspaperAdvertisement: requiredFileSchema.optional().or(z.literal('')),
});

export const passportIndiaTatkalSchema = z.object({
  serviceType: z.literal('tatkal-passport'),

  proofOfUrgency: requiredFileSchema.optional().or(z.literal('')),
  aadhaarIdProof: requiredFileSchema.optional().or(z.literal('')),
  policeVerificationDocument: requiredFileSchema.optional().or(z.literal('')),
  applicationForm: requiredFileSchema.optional().or(z.literal('')),
  photos: requiredFileSchema.optional().or(z.literal('')),

  appointmentConfirmationSlip: requiredFileSchema.optional().or(z.literal('')),
});

export const passportIndiaNameChangeSchema = z.object({
  serviceType: z.literal('india-passport-name-change'),

  currentPassport: requiredFileSchema.optional().or(z.literal('')),
  gazetteLegalNameChangeCertificate: requiredFileSchema.optional().or(z.literal('')),
  marriageDivorceCertificate: requiredFileSchema.optional().or(z.literal('')),
  photos: requiredFileSchema.optional().or(z.literal('')),

  affidavitForNameChange: requiredFileSchema.optional().or(z.literal('')),
});

export const indiaSurrenderWithPassportSchema = z.object({
  serviceType: z.literal('surrender-with-indian-passport-1'),

  photograph2x2: requiredFileSchema.optional().or(z.literal('')),
  signature: requiredFileSchema.optional().or(z.literal('')),

  declarationFromOffice: requiredFileSchema.optional().or(z.literal('')),

  addressProof: requiredFileSchema.optional().or(z.literal('')),
  indianPassportOriginal: requiredFileSchema.optional().or(z.literal('')),
  indianPassportCopy: requiredFileSchema.optional().or(z.literal('')),

  usPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),

  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),

  spouseUsPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  spouseIndianPassportOrOciCopy: requiredFileSchema.optional().or(z.literal('')),
  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),

  familyOciCardCopy: requiredFileSchema.optional().or(z.literal('')),
  previousIndianVisaCopy: requiredFileSchema.optional().or(z.literal('')),
});

export const indiaSurrenderWithoutPassportSchema = z.object({
  serviceType: z.literal('surrender-without-indian-passport-1'),

  photograph2x2: requiredFileSchema.optional().or(z.literal('')),
  signature: requiredFileSchema.optional().or(z.literal('')),

  declarationFromOffice: requiredFileSchema.optional().or(z.literal('')),

  addressProof: requiredFileSchema.optional().or(z.literal('')),

  usPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),

  proofOfIndianOrigin: requiredFileSchema.optional().or(z.literal('')),
  policeReport: requiredFileSchema.optional().or(z.literal('')),

  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),
});

export const indiaSurrenderMinorPassportSchema = z.object({
  serviceType: z.literal('surrender-minor-indian-passport'),

  indianPassportOriginal: requiredFileSchema.optional().or(z.literal('')),
  indianPassportCopy: requiredFileSchema.optional().or(z.literal('')),

  usPassportCopy: requiredFileSchema.optional().or(z.literal('')),

  parentsNaturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
  parentsPassportCopies: requiredFileSchema.optional().or(z.literal('')),

  familyOciCardCopy: requiredFileSchema.optional().or(z.literal('')),

  parentsAddressProof: requiredFileSchema.optional().or(z.literal('')),

  previousIndianVisaCopy: requiredFileSchema.optional().or(z.literal('')),

  photographs2x2: requiredFileSchema.optional().or(z.literal('')),

  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),

  parentalAuthorizationForm: requiredFileSchema.optional().or(z.literal('')),
  swornAffidavitByParents: requiredFileSchema.optional().or(z.literal('')),
});
