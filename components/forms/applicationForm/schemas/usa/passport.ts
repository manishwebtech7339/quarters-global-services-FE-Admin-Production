import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const passportUSANewDS11Schema = z.object({
  serviceType: z.literal('new-passport'),

  proofOfCitizenship: requiredFileSchema.optional().or(z.literal('')),
  proofOfIdentity: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto2x2: requiredFileSchema.optional().or(z.literal('')),
  socialSecurityNumber: requiredFileSchema.optional().or(z.literal('')),
  ds11Form: requiredFileSchema.optional().or(z.literal('')),

  // appointmentConfirmation: requiredFileSchema.optional().or(z.literal('')),
});

export const passportUSARenewalDS82Schema = z.object({
  serviceType: z.literal('renewal'),

  mostRecentPassport: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto2x2: requiredFileSchema.optional().or(z.literal('')),
  ds82Form: requiredFileSchema.optional().or(z.literal('')),
  paymentReceipt: requiredFileSchema.optional().or(z.literal('')),
  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),

  // oldPassportSubmission: requiredFileSchema.optional().or(z.literal('')),
});

export const passportUSAChildUnder16Schema = z.object({
  serviceType: z.literal('child-passport'),

  proofOfCitizenship: requiredFileSchema.optional().or(z.literal('')),
  parentsIdCopies: requiredFileSchema.optional().or(z.literal('')),
  parentalConsent: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto2x2: requiredFileSchema.optional().or(z.literal('')),
  ds11Form: requiredFileSchema.optional().or(z.literal('')),

  // parentsMarriageCertificate: requiredFileSchema.optional().or(z.literal('')),
});

export const passportUSALostSchema = z.object({
  serviceType: z.literal('lost-passport'),

  ds64StatementOfLoss: requiredFileSchema.optional().or(z.literal('')),
  ds11Form: requiredFileSchema.optional().or(z.literal('')),
  proofOfCitizenship: requiredFileSchema.optional().or(z.literal('')),
  proofOfIdentity: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto2x2: requiredFileSchema.optional().or(z.literal('')),

  // policeReport: requiredFileSchema.optional().or(z.literal('')),
});

export const passportUSAStolenSchema = z.object({
  serviceType: z.literal('stolen-passport'),

  ds64StatementOfLoss: requiredFileSchema.optional().or(z.literal('')),
  ds11Form: requiredFileSchema.optional().or(z.literal('')),
  proofOfCitizenship: requiredFileSchema.optional().or(z.literal('')),
  proofOfIdentity: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto2x2: requiredFileSchema.optional().or(z.literal('')),

  // policeReport: requiredFileSchema.optional().or(z.literal('')),
});

export const passportUSADamagedSchema = z.object({
  serviceType: z.literal('damaged-passport'),

  ds64StatementOfLoss: requiredFileSchema.optional().or(z.literal('')),
  ds11Form: requiredFileSchema.optional().or(z.literal('')),
  proofOfCitizenship: requiredFileSchema.optional().or(z.literal('')),
  proofOfIdentity: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto2x2: requiredFileSchema.optional().or(z.literal('')),

  // damagedPassportSubmission: requiredFileSchema.optional().or(z.literal('')),
});

export const passportUSACardSchema = z.object({
  serviceType: z.literal('usa-passport-card'),

  ds11OrDs82Form: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto2x2: requiredFileSchema.optional().or(z.literal('')),
  proofOfCitizenship: requiredFileSchema.optional().or(z.literal('')),
  proofOfIdentity: requiredFileSchema.optional().or(z.literal('')),

  // previousPassportCopy: requiredFileSchema.optional().or(z.literal('')),
});

export const passportUSANameChangeCorrectionSchema = z.object({
  serviceType: z.literal('name-change'),

  ds5504Form: requiredFileSchema.optional().or(z.literal('')),
  currentPassport: requiredFileSchema.optional().or(z.literal('')),
  legalNameChangeDocument: requiredFileSchema.optional().or(z.literal('')),

  // affidavitForNameChange: requiredFileSchema.optional().or(z.literal('')),
});

export const passportUSASecondSchema = z.object({
  serviceType: z.literal('second-passport'),

  ds82OrDs11Form: requiredFileSchema.optional().or(z.literal('')),
  currentValidPassport: requiredFileSchema.optional().or(z.literal('')),
  letterOfJustification: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto2x2: requiredFileSchema.optional().or(z.literal('')),

  // employerTravelLetter: requiredFileSchema.optional().or(z.literal('')),
});

export const passportUSASecondValidSchema = z.object({
  serviceType: z.literal('second-valid-passport'),

  ds82OrDs11Form: requiredFileSchema.optional().or(z.literal('')),
  currentValidPassport: requiredFileSchema.optional().or(z.literal('')),
  letterOfJustification: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),

  // employerTravelLetter: requiredFileSchema.optional().or(z.literal('')),
});

export const passportUSAExpeditedServiceSchema = z.object({
  serviceType: z.literal('expedited-passport-service'),

  proofOfUrgentTravel: requiredFileSchema.optional().or(z.literal('')),
  expeditedFeePayment: requiredFileSchema.optional().or(z.literal('')),
  standardRequiredDocs: requiredFileSchema.optional().or(z.literal('')),

  // appointmentConfirmation: requiredFileSchema.optional().or(z.literal('')),
});

export const passportUSAEmergencySameDaySchema = z.object({
  serviceType: z.literal('emergency-or-same-day-passport'),

  proofOfEmergency: requiredFileSchema.optional().or(z.literal('')),
  proofOfTravel: requiredFileSchema.optional().or(z.literal('')),
  requiredStandardDocs: requiredFileSchema.optional().or(z.literal('')),

  // appointmentConfirmation: requiredFileSchema.optional().or(z.literal('')),
});
