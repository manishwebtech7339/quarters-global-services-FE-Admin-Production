import { z } from 'zod';
import { requiredFileSchema, serviceTypes } from '../common';

// ---- USA PASSPORT SCHEMAS ----

// USA New Passport (DS-11)
export const passportUSANewDS11Schema = z.object({
  serviceType: z.literal(serviceTypes['new-passport']),
  proofOfCitizenship: requiredFileSchema,
  proofOfIdentity: requiredFileSchema,
  passportPhoto2x2: requiredFileSchema,
  socialSecurityNumber: z.string().min(1, 'Social Security Number is required'),
  ds11Form: requiredFileSchema,
});

// USA Passport Renewal (DS-82)
export const passportUSARenewalDS82Schema = z.object({
  serviceType: z.literal(serviceTypes['usa-passport-renewal']),
  mostRecentPassport: requiredFileSchema,
  passportPhoto2x2: requiredFileSchema,
  ds82Form: requiredFileSchema,
  paymentReceipt: requiredFileSchema,
  nameChangeDocument: requiredFileSchema.optional(),
});

// USA Child Passport (Under 16)
export const passportUSAChildUnder16Schema = z.object({
  serviceType: z.literal(serviceTypes['child-passport']),
  proofOfCitizenship: requiredFileSchema,
  parentsIdCopies: requiredFileSchema,
  parentalConsent: requiredFileSchema,
  passportPhotos: requiredFileSchema,
  ds11Form: requiredFileSchema,
});

// USA Lost/Stolen/Damaged Passport
export const passportUSALostSchema = z.object({
  serviceType: z.literal(serviceTypes['lost-passport']),
  ds64StatementOfLoss: requiredFileSchema,
  ds11Form: requiredFileSchema,
  proofOfCitizenship: requiredFileSchema,
  proofOfIdentity: requiredFileSchema,
  passportPhoto: requiredFileSchema,
});
export const passportUSAStolenSchema = z.object({
  serviceType: z.literal(serviceTypes['stolen-passport']),
  ds64StatementOfLoss: requiredFileSchema,
  ds11Form: requiredFileSchema,
  proofOfCitizenship: requiredFileSchema,
  proofOfIdentity: requiredFileSchema,
  passportPhoto: requiredFileSchema,
});
export const passportUSADamagedSchema = z.object({
  serviceType: z.literal(serviceTypes['damaged-passport']),
  ds64StatementOfLoss: requiredFileSchema,
  ds11Form: requiredFileSchema,
  proofOfCitizenship: requiredFileSchema,
  proofOfIdentity: requiredFileSchema,
  passportPhoto: requiredFileSchema,
});

// USA Passport Card
export const passportUSACardSchema = z.object({
  serviceType: z.literal(serviceTypes['usa-passport-card']),
  ds11OrDs82Form: requiredFileSchema,
  passportPhoto: requiredFileSchema,
  proofOfCitizenship: requiredFileSchema,
  proofOfIdentity: requiredFileSchema,
});

// USA Name Change/Correction
export const passportUSANameChangeCorrectionSchema = z.object({
  serviceType: z.literal(serviceTypes['name-change']),
  ds5504Form: requiredFileSchema,
  currentPassport: requiredFileSchema,
  legalNameChangeDocument: requiredFileSchema,
});

// USA Second Valid Passport
export const passportUSASecondValidSchema = z.object({
  serviceType: z.literal(serviceTypes['second-passport']),
  ds82OrDs11Form: requiredFileSchema,
  currentValidPassport: requiredFileSchema,
  letterOfJustification: requiredFileSchema,
  passportPhoto: requiredFileSchema,
});

// USA Expedited Service
export const passportUSAExpeditedServiceSchema = z.object({
  serviceType: z.literal(serviceTypes['expedited-passport-service']),
  proofOfUrgentTravel: requiredFileSchema,
  expeditedFeePayment: requiredFileSchema,
  standardRequiredDocs: requiredFileSchema,
});

// USA Emergency/Same-Day Passport
export const passportUSAEmergencySameDaySchema = z.object({
  serviceType: z.literal(serviceTypes['emergency-or-same-day-passport']),
  proofOfEmergency: requiredFileSchema,
  proofOfTravel: requiredFileSchema,
  requiredStandardDocs: requiredFileSchema,
});
