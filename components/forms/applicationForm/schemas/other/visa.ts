import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const visaGlobalSchema = z.object({
  serviceType: z.literal('visa-global'),

  // 🛂 Identity & Passport
  validPassport: requiredFileSchema,
  blankPassportPagesProof: requiredFileSchema.optional(),
  oldPassports: requiredFileSchema.optional(),
  nationalIdOrResidencePermit: requiredFileSchema.optional(),

  // 📄 Previous Visa History
  previousVisaCopiesAllCountries: requiredFileSchema.optional(),
  previousVisaNumbers: requiredFileSchema.optional(),
  entryExitStampCopies: requiredFileSchema.optional(),
  currentVisasInOldPassports: requiredFileSchema.optional(),
  longTermVisaDetails: requiredFileSchema.optional(),

  // ❌ Visa Refusal / Rejection History
  visaRefusalLetters: requiredFileSchema.optional(),
  visaRefusalDateCountry: requiredFileSchema.optional(),
  visaRejectionReason: requiredFileSchema.optional(),
  visaRejectionExplanationLetter: requiredFileSchema.optional(),
  immigrationOverstayDetails: requiredFileSchema.optional(),

  // 📸 Photographs
  passportPhotographs: requiredFileSchema,

  // ✈️ Travel Proof
  flightReservation: requiredFileSchema.optional(),
  hotelAccommodationProof: requiredFileSchema.optional(),
  travelItinerary: requiredFileSchema.optional(),
  onwardReturnTravelProof: requiredFileSchema.optional(),

  // 💰 Financial Proof
  bankStatements: requiredFileSchema.optional(),
  proofOfFunds: requiredFileSchema.optional(),
  salarySlipsOrIncomeProof: requiredFileSchema.optional(),
  sponsorFinancialProof: requiredFileSchema.optional(),

  // 💼 Employment / Business / Study
  employmentOrJobProof: requiredFileSchema.optional(),
  approvedLeaveLetter: requiredFileSchema.optional(),
  businessRegistrationDocuments: requiredFileSchema.optional(),
  studentEnrollmentProof: requiredFileSchema.optional(),

  // 🏠 Residence & Home Ties
  currentAddressProof: requiredFileSchema.optional(),
  utilityBillOrLeaseOrMortgage: requiredFileSchema.optional(),
  familyRelationshipProof: requiredFileSchema.optional(),

  // 📝 Purpose of Travel Support
  invitationLetter: requiredFileSchema.optional(),
  hostIdOrPassportCopy: requiredFileSchema.optional(),
  eventConferenceAdmissionProof: requiredFileSchema.optional(),

  // 🏥 Insurance & Health
  travelMedicalInsurance: requiredFileSchema.optional(),
  medicalReport: requiredFileSchema.optional(),
  vaccinationRecord: requiredFileSchema.optional(),

  // ⚖️ Legal & Background
  policeClearanceCertificate: requiredFileSchema.optional(),
  marriageCertificate: requiredFileSchema.optional(),
  birthCertificateForMinors: requiredFileSchema.optional(),
  parentalConsentLetter: requiredFileSchema.optional(),

  // 📦 Final Supporting Documents
  allPreviousVisaStampCopies: requiredFileSchema.optional(),
  nameChangeDocuments: requiredFileSchema.optional(),
  sponsorshipOrGuaranteeLetter: requiredFileSchema.optional(),
  documentTranslations: requiredFileSchema.optional(),

  // ✅ Final Review / Notes
  finalChecklistAcknowledgement: requiredFileSchema.optional(),
});

export const visaCanadaVisitorSchema = z.object({
  serviceType: z.literal('canada-visitor-visa'),

  validPassport: requiredFileSchema,
  visaApplicationForm: requiredFileSchema,
  passportPhotos: requiredFileSchema,
  proofOfFunds: requiredFileSchema,
  travelItinerary: requiredFileSchema,
});

export const visaCanadaStudentSchema = z.object({
  serviceType: z.literal('canada-student-visa'),

  validPassport: requiredFileSchema,
  visaApplicationForm: requiredFileSchema,
  passportPhotos: requiredFileSchema,
  admissionLetter: requiredFileSchema,
  proofOfFunds: requiredFileSchema,
});

export const visaCanadaWorkPermitSchema = z.object({
  serviceType: z.literal('canada-work-permit'),

  validPassport: requiredFileSchema,
  visaApplicationForm: requiredFileSchema,
  jobOfferLetter: requiredFileSchema,
  passportPhotos: requiredFileSchema,
});

export const visaCanadaPRSchema = z.object({
  serviceType: z.literal('canada-permanent-residency'),

  validPassport: requiredFileSchema,
  applicationForm: requiredFileSchema,
  passportPhotos: requiredFileSchema,
  proofOfFunds: requiredFileSchema,
});

export const visaUKTouristSchema = z.object({
  serviceType: z.literal('uk-tourist-visa'),

  validPassport: requiredFileSchema,
  visaApplicationForm: requiredFileSchema,
  passportPhotos: requiredFileSchema,
  travelItinerary: requiredFileSchema,
  proofOfFunds: requiredFileSchema,
});

export const visaUKStudentSchema = z.object({
  serviceType: z.literal('uk-student-visa'),

  validPassport: requiredFileSchema,
  visaApplicationForm: requiredFileSchema,
  passportPhotos: requiredFileSchema,
  casLetter: requiredFileSchema,
  proofOfFunds: requiredFileSchema,
});

export const visaUKWorkSchema = z.object({
  serviceType: z.literal('uk-work-visa'),

  validPassport: requiredFileSchema,
  visaApplicationForm: requiredFileSchema,
  jobOfferLetter: requiredFileSchema,
  passportPhotos: requiredFileSchema,
});

export const visaUKDependentSchema = z.object({
  serviceType: z.literal('uk-dependent-visa'),

  validPassport: requiredFileSchema,
  visaApplicationForm: requiredFileSchema,
  relationshipProof: requiredFileSchema,
  passportPhotos: requiredFileSchema,
});

export const visaSchengenTouristSchema = z.object({
  serviceType: z.literal('schengen-tourist-visa'),

  validPassport: requiredFileSchema,
  visaApplicationForm: requiredFileSchema,
  passportPhotos: requiredFileSchema,
  travelItinerary: requiredFileSchema,
  travelInsurance: requiredFileSchema,
});

export const visaSchengenBusinessSchema = z.object({
  serviceType: z.literal('schengen-business-visa'),

  validPassport: requiredFileSchema,
  visaApplicationForm: requiredFileSchema,
  invitationLetter: requiredFileSchema,
  passportPhotos: requiredFileSchema,
  travelInsurance: requiredFileSchema,
});

export const visaSchengenStudentSchema = z.object({
  serviceType: z.literal('schengen-student-visa'),

  validPassport: requiredFileSchema,
  visaApplicationForm: requiredFileSchema,
  admissionLetter: requiredFileSchema,
  passportPhotos: requiredFileSchema,
  travelInsurance: requiredFileSchema,
});
