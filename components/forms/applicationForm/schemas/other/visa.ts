import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const visaOtherTouristSchema = z.object({
  serviceType: z.literal('tourist-visa-1'),

  passportCopy: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),
  visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  flightItinerary: requiredFileSchema.optional().or(z.literal('')),
  hotelBooking: requiredFileSchema.optional().or(z.literal('')),
  travelInsurance: requiredFileSchema.optional().or(z.literal('')),
  bankStatement6Months: requiredFileSchema.optional().or(z.literal('')),
  employmentProofOrNoc: requiredFileSchema.optional().or(z.literal('')),
  salarySlipOrFundsProof: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  previousVisaCopies: requiredFileSchema.optional().or(z.literal('')),
  declarationForm: requiredFileSchema.optional().or(z.literal('')),
});

export const visaOtherBusinessSchema = z.object({
  serviceType: z.literal('business-visa-1'),

  passportCopy: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),
  visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  invitationLetter: requiredFileSchema.optional().or(z.literal('')),
  businessCoverLetter: requiredFileSchema.optional().or(z.literal('')),
  companyRegistrationCertificate: requiredFileSchema.optional().or(z.literal('')),
  employmentLetterOrId: requiredFileSchema.optional().or(z.literal('')),
  bankStatement: requiredFileSchema.optional().or(z.literal('')),
  travelItinerary: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  travelInsurance: requiredFileSchema.optional().or(z.literal('')),
  authorizationLetter: requiredFileSchema.optional().or(z.literal('')),
});
