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

  originalIndianPassport: requiredFileSchema.optional().or(z.literal('')),
  legalStatusCopy: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos2x2: requiredFileSchema.optional().or(z.literal('')),
  birthCertificate: requiredFileSchema.optional().or(z.literal('')),
  spousePassportCopy: requiredFileSchema.optional().or(z.literal('')),
  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),
  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  indianAddressProof: requiredFileSchema.optional().or(z.literal('')),
  affidavitChangeAppearanceSignature: requiredFileSchema.optional().or(z.literal('')),
  annexureEForm: requiredFileSchema.optional().or(z.literal('')),

  // applicationForm: requiredFileSchema.optional().or(z.literal('')),
  // policeVerificationDocument: requiredFileSchema.optional().or(z.literal('')),
});

export const passportIndiaRenewalMinorSchema = z.object({
  serviceType: z.literal('minor-renewal'),

  originalIndianPassport: requiredFileSchema.optional().or(z.literal('')),
  parentsLegalStatusCopy: requiredFileSchema.optional().or(z.literal('')),
  parentsDriverLicenseCopy: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos2x2: requiredFileSchema.optional().or(z.literal('')),
  parentsPassportCopies: requiredFileSchema.optional().or(z.literal('')),
  birthCertificate: requiredFileSchema.optional().or(z.literal('')),
  applicantLegalStatusCopy: requiredFileSchema.optional().or(z.literal('')),
  indianAddressProof: requiredFileSchema.optional().or(z.literal('')),
  affidavitChangeAppearanceSignature: requiredFileSchema.optional().or(z.literal('')),
  annexureDForm: requiredFileSchema.optional().or(z.literal('')),
  annexureEForm: requiredFileSchema.optional().or(z.literal('')),

  // applicationForm: requiredFileSchema.optional().or(z.literal('')),
  // proofOfAddress: requiredFileSchema.optional().or(z.literal('')),
  // parentsConsentForm: requiredFileSchema.optional().or(z.literal('')),
});

export const passportIndiaLostDamagedSchema = z.object({
  serviceType: z.literal('lost-passport-1'),

  originalOrCopyWithPoliceReport: requiredFileSchema.optional().or(z.literal('')),
  legalStatusCopy: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos2x2: requiredFileSchema.optional().or(z.literal('')),
  birthCertificate: requiredFileSchema.optional().or(z.literal('')),
  spousePassportCopy: requiredFileSchema.optional().or(z.literal('')),
  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),
  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  indianAddressProof: requiredFileSchema.optional().or(z.literal('')),

  // applicationForm: requiredFileSchema.optional().or(z.literal('')),
  // newspaperAdvertisement: requiredFileSchema.optional().or(z.literal('')),
});

export const passportIndiaTatkalSchema = z.object({
  serviceType: z.literal('tatkal-passport'),

  originalIndianPassport: requiredFileSchema.optional().or(z.literal('')),
  legalStatusCopy: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos2x2: requiredFileSchema.optional().or(z.literal('')),
  birthCertificate: requiredFileSchema.optional().or(z.literal('')),
  spousePassportCopy: requiredFileSchema.optional().or(z.literal('')),
  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),
  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  indianAddressProof: requiredFileSchema.optional().or(z.literal('')),

  // proofOfUrgency: requiredFileSchema.optional().or(z.literal('')),
  // aadhaarIdProof: requiredFileSchema.optional().or(z.literal('')),
  // policeVerificationDocument: requiredFileSchema.optional().or(z.literal('')),
  // applicationForm: requiredFileSchema.optional().or(z.literal('')),
  // appointmentConfirmationSlip: requiredFileSchema.optional().or(z.literal('')),
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
  declarationForm: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  indianPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  usPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),
  spousePassportCopies: requiredFileSchema.optional().or(z.literal('')),
  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  familyOciCardCopy: requiredFileSchema.optional().or(z.literal('')),
  previousIndianVisaCopy: requiredFileSchema.optional().or(z.literal('')),

  // indianPassportOriginal: requiredFileSchema.optional().or(z.literal('')),
});

export const indiaSurrenderWithoutPassportSchema = z.object({
  serviceType: z.literal('surrender-without-indian-passport-1'),

  photograph2x2: requiredFileSchema.optional().or(z.literal('')),
  signature: requiredFileSchema.optional().or(z.literal('')),
  declarationForm: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  usPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
  proofOfIndianOrigin: requiredFileSchema.optional().or(z.literal('')),
  policeReport: requiredFileSchema.optional().or(z.literal('')),
  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),
});

export const indiaSurrenderMinorPassportSchema = z.object({
  serviceType: z.literal('surrender-minor-indian-passport'),

  indianPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  usPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  parentsNaturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
  parentsPassportCopies: requiredFileSchema.optional().or(z.literal('')),
  familyOciCardCopy: requiredFileSchema.optional().or(z.literal('')),
  parentsAddressProof: requiredFileSchema.optional().or(z.literal('')),
  previousIndianVisaCopy: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos2x2: requiredFileSchema.optional().or(z.literal('')),
  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),
  parentalAuthorizationForm: requiredFileSchema.optional().or(z.literal('')),
  swornAffidavitByParents: requiredFileSchema.optional().or(z.literal('')),
});
