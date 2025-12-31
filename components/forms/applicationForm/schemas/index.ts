// Main schemas index file - exports all schemas and types
import { z } from 'zod';

// Export all schemas and common types
export * from './usa/visa';
export * from './usa/passport';
export * from './india/visa';
export * from './india/passport';
export * from './common';

// Import additional schema functions

// Import all schemas for the discriminated union
import {
  // USA Visa Schemas
  visaUSB1B2Schema,
  visaUSStudentSchema,
  visaUSExchangeVisitorSchema,
  visaUSBusinessSchema,
  visaUSTemporaryWorkerSchema,
  visaUSIntraCompanyTransferSchema,
  visaUSExtraordinaryAbilitySchema,
  visaUSAthleteArtistSchema,
  visaUSReligiousWorkerSchema,
  visaUSNAFTASchema,
  visaUSImmediateRelativeSchema,
  visaUSFamilyPreferenceSchema,
  visaUSEmploymentBasedSchema,
  visaUSDiversityLotterySchema,
  visaUSFianceSchema,
  visaUSSpouseSchema,
  visaUSWitnessInformantSchema,
  visaUSTraffickingVictimsSchema,
  visaUSCrimeVictimsSchema,
} from './usa/visa';

import {
  // USA Passport Schemas
  passportUSANewDS11Schema,
  passportUSARenewalDS82Schema,
  passportUSAChildUnder16Schema,
  passportUSACardSchema,
  passportUSANameChangeCorrectionSchema,
  passportUSASecondValidSchema,
  passportUSAExpeditedServiceSchema,
  passportUSAEmergencySameDaySchema,
  passportUSADamagedSchema,
  passportUSAStolenSchema,
  passportUSALostSchema,
} from './usa/passport';

import {
  // India Visa Schemas
  visaIndiaTouristSchema,
  visaIndiaBusinessSchema,
  visaIndiaStudentSchema,
  visaIndiaMedicalSchema,
  visaIndiaConferenceSchema,
  visaIndiaEmploymentSchema,
  // visaIndiaEVisaTouristSchema,
  // visaIndiaEVisaBusinessSchema,
  // visaIndiaEVisaMedicalSchema,
} from './india/visa';

import {
  // India Passport Schemas
  passportIndiaNewAdultSchema,
  passportIndiaNewMinorSchema,
  passportIndiaRenewalAdultSchema,
  passportIndiaRenewalMinorSchema,
  passportIndiaLostDamagedSchema,
  passportIndiaTatkalSchema,
  passportIndiaNameChangeSchema,
} from './india/passport';
import { emptySchema } from './common';

// ---- Union ----
export const serviceDocumentsSchemas = z.discriminatedUnion('serviceType', [
  emptySchema, // Default empty schema
  // USA Visa Schemas
  visaUSB1B2Schema,
  visaUSStudentSchema,
  visaUSExchangeVisitorSchema,
  visaUSBusinessSchema,
  visaUSTemporaryWorkerSchema,
  visaUSIntraCompanyTransferSchema,
  visaUSExtraordinaryAbilitySchema,
  visaUSAthleteArtistSchema,
  visaUSReligiousWorkerSchema,
  visaUSNAFTASchema,
  visaUSImmediateRelativeSchema,
  visaUSFamilyPreferenceSchema,
  visaUSEmploymentBasedSchema,
  visaUSDiversityLotterySchema,
  visaUSFianceSchema,
  visaUSSpouseSchema,
  visaUSWitnessInformantSchema,
  visaUSTraffickingVictimsSchema,
  visaUSCrimeVictimsSchema,
  // India Visa Schemas
  visaIndiaTouristSchema,
  visaIndiaBusinessSchema,
  visaIndiaStudentSchema,
  visaIndiaMedicalSchema,
  visaIndiaConferenceSchema,
  visaIndiaEmploymentSchema,
  // visaIndiaEVisaTouristSchema,
  // visaIndiaEVisaBusinessSchema,
  // visaIndiaEVisaMedicalSchema,
  // USA Passport Schemas
  passportUSANewDS11Schema,
  passportUSARenewalDS82Schema,
  passportUSAChildUnder16Schema,
  passportUSALostSchema,
  passportUSAStolenSchema,
  passportUSADamagedSchema,
  passportUSACardSchema,
  passportUSANameChangeCorrectionSchema,
  passportUSASecondValidSchema,
  passportUSAExpeditedServiceSchema,
  passportUSAEmergencySameDaySchema,
  // India Passport Schemas
  passportIndiaNewAdultSchema,
  passportIndiaNewMinorSchema,
  passportIndiaRenewalAdultSchema,
  passportIndiaRenewalMinorSchema,
  passportIndiaLostDamagedSchema,
  passportIndiaTatkalSchema,
  passportIndiaNameChangeSchema,
]);

// Base schema for application form
const baseSchema = z.object({
  // Service
  fromCountryId: z.string().min(1, 'This field is required'),
  toCountryId: z.string().min(1, 'This field is required'),
  platformServiceId: z.string().min(1, 'This field is required'),
  platformServiceCategoryId: z.string().min(1, 'This field is required'),
  platformServiceSubCategoryId: z.string().optional(),
  platformServiceCategoryPackageId: z.string().min(1, 'This field is required'),
  platformServiceCategoryPackageAddonsId: z.array(z.string().min(1, 'This field is required')),

  firstName: z.string().min(1, 'This field is required'),
  lastName: z.string().min(1, 'This field is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'This field is required'),
  country: z.string().min(1, 'This field is required'),
  address: z.string().min(1, 'This field is required'),
  city: z.string().min(1, 'This field is required'),
  state: z.string().min(1, 'This field is required'),
  pincode: z.string().min(1, 'This field is required'),
  notes: z.string().optional(),

  // Personal Information fields
  middleName: z.string().optional(),
  previousNames: z.string().optional(),
  sex: z.string().optional(),
  dob: z.string().optional(),
  birthCity: z.string().optional(),
  birthState: z.string().optional(),
  countryOfBirth: z.string().optional(),
  countryOfBirthOther: z.string().optional(),
  nationalId: z.string().optional(),
  religion: z.string().optional(),
  visibleMarks: z.string().optional(),
  educationLevel: z.string().optional(),
  educationOther: z.string().optional(),
  citizenshipCountry: z.string().optional(),
  citizenshipCountryOther: z.string().optional(),
  citizenshipAcquiredBy: z.string().optional(),
  previousCitizenship: z.string().optional(),
  previousCitizenshipOther: z.string().optional(),

  // Passport Details fields
  passportNumber: z.string().optional(),
  passportIssuingAuthority: z.string().optional(),
  passportIssueDate: z.string().optional(),
  passportExpiryDate: z.string().optional(),
  holdsOtherPassport: z.string().optional(),
  otherPassportNumber: z.string().optional(),
  otherPassportIssuingAuthority: z.string().optional(),
  otherPassportIssueDate: z.string().optional(),
  otherPassportExpiryDate: z.string().optional(),

  // Contact Information fields
  homeAddress: z.string().optional(),
  homeCity: z.string().optional(),
  homeState: z.string().optional(),
  homeZip: z.string().optional(),
  isPermanentAddress: z.string().optional(),
  permAddress: z.string().optional(),
  permCity: z.string().optional(),
  permState: z.string().optional(),
  permZip: z.string().optional(),
  permCountry: z.string().optional(),
  homePhone: z.string().optional(),
  mobilePhone: z.string().optional(),
  homeEmail: z.string().optional(),

  // Family Information fields
  fatherName: z.string().optional(),
  fatherBirthCity: z.string().optional(),
  fatherBirthState: z.string().optional(),
  fatherBirthCountry: z.string().optional(),
  fatherCitizenship: z.string().optional(),
  fatherPrevCitizenship: z.string().optional(),
  motherName: z.string().optional(),
  motherBirthCity: z.string().optional(),
  motherBirthState: z.string().optional(),
  motherBirthCountry: z.string().optional(),
  motherCitizenship: z.string().optional(),
  motherPrevCitizenship: z.string().optional(),
  maritalStatus: z.string().optional(),
  spouseName: z.string().optional(),
  spouseCitizenship: z.string().optional(),
  spousePrevCitizenship: z.string().optional(),
  spouseBirthCity: z.string().optional(),
  spouseBirthState: z.string().optional(),
  spouseBirthCountry: z.string().optional(),
  grandparentsPakistan: z.string().optional(),
  grandparentsPakistanDetails: z.string().optional(),

  // Work/School Information fields
  occupation: z.string().optional(),
  jobTitle: z.string().optional(),
  employerOrSchool: z.string().optional(),
  workAddress: z.string().optional(),
  workCity: z.string().optional(),
  workState: z.string().optional(),
  workZip: z.string().optional(),
  workPhone: z.string().optional(),
  workEmail: z.string().optional(),
  previousOccupation: z.string().optional(),
  militaryService: z.string().optional(),
  militaryCountryBranch: z.string().optional(),
  militarySpecialization: z.string().optional(),
  militaryHighestRank: z.string().optional(),
  militaryCity: z.string().optional(),
  militaryState: z.string().optional(),
  militaryCountry: z.string().optional(),

  // Travel to India fields
  visaType: z.string().optional(),
  expectedArrivalDate: z.string().optional(),
  arrivalCity: z.string().optional(),
  exitCity: z.string().optional(),
  otherIndianCities: z.string().optional(),
  purposeOfVisit: z.string().optional(),
  previousVisitToIndia: z.string().optional(),
  prevHotelAddress: z.string().optional(),
  prevCitiesVisited: z.string().optional(),
  prevVisaNumber: z.string().optional(),
  prevVisaIssuedBy: z.string().optional(),
  prevVisaType: z.string().optional(),
  prevVisaIssuedDate: z.string().optional(),
  visaRefused: z.string().optional(),
  visaRefusalDetails: z.string().optional(),
  countriesVisited10Years: z.string().optional(),

  // Reference in India fields
  refIndiaName: z.string().optional(),
  refIndiaCompany: z.string().optional(),
  refIndiaAddress1: z.string().optional(),
  refIndiaAddress2: z.string().optional(),
  refIndiaPhone: z.string().optional(),
  refIndiaEmail: z.string().optional(),

  // Reference in USA fields
  refUSAName: z.string().optional(),
  refUSACompany: z.string().optional(),
  refUSAAddress: z.string().optional(),
  refUSACity: z.string().optional(),
  refUSAState: z.string().optional(),
  refUSAZip: z.string().optional(),
  refUSAPhone: z.string().optional(),
  refUSAEmail: z.string().optional(),

  // Additional Questions fields
  refusedEntryDeported: z.string().optional(),
  refusedEntryDetails: z.string().optional(),
  everArrested: z.string().optional(),
  arrestedDetails: z.string().optional(),
  everConvicted: z.string().optional(),
  convictedDetails: z.string().optional(),

  // Additional service fields
  additionalServiceFields: z
    .object({
      paymentMethod: z.string().optional(),
      paymentStatus: z.string().optional(),
      totalAmount: z.string().optional(),
      paidAmount: z.string().optional(),
      paymentId: z.string().optional(),
      courierId: z.string().optional(),
      passportNumber: z.string().optional(),
    })
    .optional(),
});

// Create the application validator

export const createApplicationValidator = baseSchema.extend({
  documents: serviceDocumentsSchemas,
});

export type CreateApplicationType = z.infer<typeof createApplicationValidator>;

// ---- Utility Functions ----

/**
 * Extract field information from a Zod schema for dynamic form generation
 */
export function getSchemaFields(schema: z.ZodTypeAny): Array<{
  name: string;
  type: 'file' | 'text';
  required: boolean;
  label: string;
}> {
  if (!(schema instanceof z.ZodObject)) {
    return [];
  }

  const shape = schema.shape;
  const fields: Array<{
    name: string;
    type: 'file' | 'text';
    required: boolean;
    label: string;
  }> = [];

  for (const [fieldName, fieldSchema] of Object.entries(shape)) {
    // Skip serviceType field as it's handled separately
    if (fieldName === 'serviceType') continue;

    const isOptional =
      fieldSchema instanceof z.ZodOptional || (fieldSchema as any)._def?.typeName === 'ZodOptional';

    const unwrappedSchema: any =
      fieldSchema instanceof z.ZodOptional ? (fieldSchema as any)._def.innerType : fieldSchema;

    // Prefer .description if available
    const fieldType =
      unwrappedSchema.description === 'file' || unwrappedSchema instanceof z.ZodType
        ? unwrappedSchema instanceof z.ZodString
          ? 'text'
          : 'file'
        : 'file';

    // Convert camelCase to Title Case for labels
    const label = fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    fields.push({
      name: fieldName,
      type: fieldType,
      required: !isOptional,
      label,
    });
  }

  return fields;
}
