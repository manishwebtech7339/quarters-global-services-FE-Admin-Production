import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const visaUSB1B2Schema = z.object({
  serviceType: z.literal('b1b2-visitor-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  visaFeeReceipt: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),
  travelItinerary: requiredFileSchema.optional().or(z.literal('')),
  bankStatements: requiredFileSchema.optional().or(z.literal('')),
  invitationLetter: requiredFileSchema.optional().or(z.literal('')),

  // employmentProof: requiredFileSchema.optional().or(z.literal('')),
  // propertyOwnershipProof: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSStudentSchema = z.object({
  serviceType: z.literal('f1-student-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  sevisFeeReceipt: requiredFileSchema.optional().or(z.literal('')),
  i20Form: requiredFileSchema.optional().or(z.literal('')),
  visaFeeReceipt: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),
  academicRecords: requiredFileSchema.optional().or(z.literal('')),
  bankStatementsSponsorLetter: requiredFileSchema.optional().or(z.literal('')),

  // englishProficiencyProof: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSExchangeVisitorSchema = z.object({
  serviceType: z.literal('j1-exchange-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  sevisFeeReceipt: requiredFileSchema.optional().or(z.literal('')),
  ds2019Form: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),
  sponsorLetter: requiredFileSchema.optional().or(z.literal('')),
  proofOfFunds: requiredFileSchema.optional().or(z.literal('')),

  // trainingProgramDetails: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSBusinessSchema = z.object({
  serviceType: z.literal('h1b-work-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  i797ApprovalNotice: requiredFileSchema.optional().or(z.literal('')),
  lcaDocument: requiredFileSchema.optional().or(z.literal('')),
  employmentLetter: requiredFileSchema.optional().or(z.literal('')),
  degreesCertificates: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),

  // resumeCV: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSTemporaryWorkerSchema = z.object({
  serviceType: z.literal('h2a-h2b-temporary-worker-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  jobOrderOfferLetter: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),
  previousVisaHistory: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSIntraCompanyTransferSchema = z.object({
  serviceType: z.literal('l1-intra-company-transfer'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  i129sI797Approval: requiredFileSchema.optional().or(z.literal('')),
  employmentLetters: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),

  // companyRelationshipProof: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSExtraordinaryAbilitySchema = z.object({
  serviceType: z.literal('o1-extraordinary-ability'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  i797Approval: requiredFileSchema.optional().or(z.literal('')),
  evidenceOfExtraordinaryAbility: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),

  // expertOpinionLetters: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSAthleteArtistSchema = z.object({
  serviceType: z.literal('p1-p3-athlete-artist-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  i797Approval: requiredFileSchema.optional().or(z.literal('')),
  contractsItinerary: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),

  // eventInvitations: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSReligiousWorkerSchema = z.object({
  serviceType: z.literal('r1-religious-worker-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  i797Approval: requiredFileSchema.optional().or(z.literal('')),
  religiousOrganizationLetter: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),

  // religiousQualificationProof: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSNAFTASchema = z.object({
  serviceType: z.literal('tntd-nafta-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  offerLetter: requiredFileSchema.optional().or(z.literal('')),
  proofOfCitizenship: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSImmediateRelativeSchema = z.object({
  serviceType: z.literal('ir-immediate-relative-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds260Confirmation: requiredFileSchema.optional().or(z.literal('')),
  civilDocuments: requiredFileSchema.optional().or(z.literal('')),
  policeCertificates: requiredFileSchema.optional().or(z.literal('')),
  medicalExam: requiredFileSchema.optional().or(z.literal('')),
  i864AffidavitOfSupport: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),

  // birthCertificate: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSFamilyPreferenceSchema = z.object({
  serviceType: z.literal('f1-f4-family-preference-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds260Confirmation: requiredFileSchema.optional().or(z.literal('')),
  civilDocuments: requiredFileSchema.optional().or(z.literal('')),
  policeCertificates: requiredFileSchema.optional().or(z.literal('')),
  i864AffidavitOfSupport: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),

  // birthCertificate: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSEmploymentBasedSchema = z.object({
  serviceType: z.literal('eb1-employment-based-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds260Confirmation: requiredFileSchema.optional().or(z.literal('')),
  i140Approval: requiredFileSchema.optional().or(z.literal('')),
  academicRecords: requiredFileSchema.optional().or(z.literal('')),
  policeCertificates: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),

  // jobOfferLetter: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSDiversityLotterySchema = z.object({
  serviceType: z.literal('dv-lottery-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  selectionLetter: requiredFileSchema.optional().or(z.literal('')),
  ds260Confirmation: requiredFileSchema.optional().or(z.literal('')),
  educationWorkProof: requiredFileSchema.optional().or(z.literal('')),
  policeCertificates: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSFianceSchema = z.object({
  serviceType: z.literal('k1-fiancee-visa-1'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  i129fApproval: requiredFileSchema.optional().or(z.literal('')),
  proofOfRelationship: requiredFileSchema.optional().or(z.literal('')),
  intentToMarryLetters: requiredFileSchema.optional().or(z.literal('')),
  policeCertificates: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),

  // relationshipChatProof: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSSpouseSchema = z.object({
  serviceType: z.literal('k3-spouse-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  i129fApproval: requiredFileSchema.optional().or(z.literal('')),
  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  relationshipEvidence: requiredFileSchema.optional().or(z.literal('')),
  policeCertificates: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSWitnessInformantSchema = z.object({
  serviceType: z.literal('s-visa-witnessesinformants'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  lawEnforcementCertification: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSTraffickingVictimsSchema = z.object({
  serviceType: z.literal('t-visa-trafficking-victims'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  proofOfTrafficking: requiredFileSchema.optional().or(z.literal('')),
  lawEnforcementDocuments: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSCrimeVictimsSchema = z.object({
  serviceType: z.literal('u-visa-crime-victims'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  ds160Confirmation: requiredFileSchema.optional().or(z.literal('')),
  formI918bCertification: requiredFileSchema.optional().or(z.literal('')),
  policeLegalRecords: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSPetitionerDocumentsSchema = z.object({
  serviceType: z.literal('petitioner-us-citizen-documents'),

  proofOfUSCitizenship: requiredFileSchema.optional().or(z.literal('')),
  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  terminationOfPriorMarriage: requiredFileSchema.optional().or(z.literal('')),
  passportStylePhoto: requiredFileSchema.optional().or(z.literal('')),
  bonaFideRelationshipEvidence: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSBeneficiaryDocumentsSchema = z.object({
  serviceType: z.literal('beneficiary-relative-documents'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  birthCertificate: requiredFileSchema.optional().or(z.literal('')),
  policeClearance: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSFinancialEvidenceSchema = z.object({
  serviceType: z.literal('financial-evidence'),

  taxReturns: requiredFileSchema.optional().or(z.literal('')),
  w2Forms: requiredFileSchema.optional().or(z.literal('')),
  payStubs: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSAdjustmentOfStatusSchema = z.object({
  serviceType: z.literal('if-adjusting-status-in-the-us'),

  proofOfLawfulEntry: requiredFileSchema.optional().or(z.literal('')),
});

export const visaUSConsularProcessingSchema = z.object({
  serviceType: z.literal('if-applying-from-abroad-consular-processing'),

  visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  civilDocuments: requiredFileSchema.optional().or(z.literal('')),
});
