import z from 'zod';
import { requiredFileSchema } from '../common';

export const medicalEVisaSchema = z.object({
  serviceType: z.literal('medical-e-visa'),

  // 🛂 Passport & Identity
  validPassport: requiredFileSchema.optional().or(z.literal('')),
  blankVisaPagesProof: requiredFileSchema.optional().or(z.literal('')),
  oldPassports: requiredFileSchema.optional().or(z.literal('')),
  passportBioPageCopy: requiredFileSchema.optional().or(z.literal('')),

  // 📄 Previous Visa History
  previousChinaVisaCopies: requiredFileSchema.optional().or(z.literal('')),
  previousOtherCountryVisaCopies: requiredFileSchema.optional().or(z.literal('')),
  previousVisaNumbers: requiredFileSchema.optional().or(z.literal('')),
  entryExitStampCopies: requiredFileSchema.optional().or(z.literal('')),

  // ❌ Visa Refusal / Rejection History
  chinaVisaRejectionDetails: requiredFileSchema.optional().or(z.literal('')),
  otherVisaRefusalDetails: requiredFileSchema.optional().or(z.literal('')),
  rejectionLetterCopy: requiredFileSchema.optional().or(z.literal('')),
  rejectionExplanationNote: requiredFileSchema.optional().or(z.literal('')),

  // 📸 Photographs
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),

  // 🏢 Business Invitation (MANDATORY)
  chinaInvitationLetter: requiredFileSchema.optional().or(z.literal('')),
  inviterBusinessLicenseCopy: requiredFileSchema.optional().or(z.literal('')),
  inviterIdOrPassportCopy: requiredFileSchema.optional().or(z.literal('')),

  // 💼 Applicant Business Proof
  employerLetter: requiredFileSchema.optional().or(z.literal('')),
  applicantBusinessCard: requiredFileSchema.optional().or(z.literal('')),
  companyRegistrationDocuments: requiredFileSchema.optional().or(z.literal('')),
  employerAuthorizationLetter: requiredFileSchema.optional().or(z.literal('')),

  // ✈️ Travel Arrangements
  flightReservation: requiredFileSchema.optional().or(z.literal('')),
  hotelBooking: requiredFileSchema.optional().or(z.literal('')),
  businessTravelItinerary: requiredFileSchema.optional().or(z.literal('')),

  // 💰 Financial Proof
  personalBankStatements: requiredFileSchema.optional().or(z.literal('')),
  companyBankStatement: requiredFileSchema.optional().or(z.literal('')),
  incomeOrSalaryProof: requiredFileSchema.optional().or(z.literal('')),
  sponsorLetter: requiredFileSchema.optional().or(z.literal('')),

  // 🏠 Residence Proof
  addressProof: requiredFileSchema.optional().or(z.literal('')),

  // 🏥 Insurance & Health
  travelMedicalInsurance: requiredFileSchema.optional().or(z.literal('')),
  healthDeclarationForm: requiredFileSchema.optional().or(z.literal('')),
  vaccinationRecord: requiredFileSchema.optional().or(z.literal('')),

  // ⚖️ Additional Supporting Documents
  previousBusinessCorrespondence: requiredFileSchema.optional().or(z.literal('')),
  tradeFairOrExhibitionProof: requiredFileSchema.optional().or(z.literal('')),
  businessRelationshipExplanationLetter: requiredFileSchema.optional().or(z.literal('')),
  embassyAdditionalDocuments: requiredFileSchema.optional().or(z.literal('')),
});
