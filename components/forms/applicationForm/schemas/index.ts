// Main schemas index file - exports all schemas and types
import { z } from 'zod';
import { emptySchema } from './common';
// USA Visa
import * as usaVisa from './usa/visa';
// USA Passport
import * as usaPassport from './usa/passport';
// India Visa
import * as indiaVisa from './india/visa';
// India E-Visa
import * as indiaEVisa from './india/evisa';
// India Passport
import * as indiaPassport from './india/passport';
// OCI
import * as indiaOci from './india/oci';
// Consular
import * as indiaConsular from './india/consular';
// ICP
import * as indiaIcp from './india/icp';
// China E-Visa
import * as chinaEVsa from './china/evisa';
// Other countries
import * as otherVisa from './other/visa';
import { commonFieldSchema, emailSchema } from '@/lib/formSchemaFunctions';

export function extractSchemas(module: Record<string, unknown>) {
  return Object.values(module).filter((v): v is z.ZodObject<any> => {
    if (!(v instanceof z.ZodObject)) return false;
    const shape = v.shape as any;
    return shape?.serviceType instanceof z.ZodLiteral;
  });
}

// ---- Union ----
export const serviceDocumentsSchemas = z.discriminatedUnion('serviceType', [
  emptySchema,
  ...extractSchemas(usaVisa),
  ...extractSchemas(usaPassport),
  ...extractSchemas(indiaVisa),
  ...extractSchemas(indiaEVisa),
  ...extractSchemas(indiaPassport),
  ...extractSchemas(indiaOci),
  ...extractSchemas(indiaConsular),
  ...extractSchemas(indiaIcp),
  ...extractSchemas(chinaEVsa),
  ...extractSchemas(otherVisa),
] as const);

// Base schema for application form
const baseSchema = z.object({
  // Service
  fromCountryId: commonFieldSchema(),
  toCountryId: commonFieldSchema(),
  platformServiceId: commonFieldSchema(),
  platformServiceCategoryId: commonFieldSchema(),
  platformServiceSubCategoryId: commonFieldSchema().optional().or(z.literal('')),
  platformServiceCategoryPackageId: commonFieldSchema(),
  platformServiceCategoryPackageAddonsId: z.array(commonFieldSchema()),

  firstName: commonFieldSchema(),
  lastName: commonFieldSchema(),
  email: emailSchema(),
  phone: commonFieldSchema(),
  country: commonFieldSchema(),
  address: commonFieldSchema(),
  city: commonFieldSchema(),
  state: commonFieldSchema(),
  pincode: commonFieldSchema(),
  notes: commonFieldSchema().optional().or(z.literal('')),

  // Personal Information fields
  middleName: commonFieldSchema().optional().or(z.literal('')),
  previousNames: commonFieldSchema().optional().or(z.literal('')),
  sex: commonFieldSchema().optional().or(z.literal('')),
  dob: commonFieldSchema().optional().or(z.literal('')),
  birthCity: commonFieldSchema().optional().or(z.literal('')),
  birthState: commonFieldSchema().optional().or(z.literal('')),
  countryOfBirth: commonFieldSchema().optional().or(z.literal('')),
  countryOfBirthOther: commonFieldSchema().optional().or(z.literal('')),
  nationalId: commonFieldSchema().optional().or(z.literal('')),
  religion: commonFieldSchema().optional().or(z.literal('')),
  visibleMarks: commonFieldSchema().optional().or(z.literal('')),
  educationLevel: commonFieldSchema().optional().or(z.literal('')),
  educationOther: commonFieldSchema().optional().or(z.literal('')),
  citizenshipCountry: commonFieldSchema().optional().or(z.literal('')),
  citizenshipCountryOther: commonFieldSchema().optional().or(z.literal('')),
  citizenshipAcquiredBy: commonFieldSchema().optional().or(z.literal('')),
  previousCitizenship: commonFieldSchema().optional().or(z.literal('')),
  previousCitizenshipOther: commonFieldSchema().optional().or(z.literal('')),

  // Passport Details fields
  passportNumber: commonFieldSchema().optional().or(z.literal('')),
  passportIssuingAuthority: commonFieldSchema().optional().or(z.literal('')),
  passportIssueDate: commonFieldSchema().optional().or(z.literal('')),
  passportExpiryDate: commonFieldSchema().optional().or(z.literal('')),
  holdsOtherPassport: commonFieldSchema().optional().or(z.literal('')),
  otherPassportNumber: commonFieldSchema().optional().or(z.literal('')),
  otherPassportIssuingAuthority: commonFieldSchema().optional().or(z.literal('')),
  otherPassportIssueDate: commonFieldSchema().optional().or(z.literal('')),
  otherPassportExpiryDate: commonFieldSchema().optional().or(z.literal('')),

  // Contact Information fields
  homeAddress: commonFieldSchema().optional().or(z.literal('')),
  homeCity: commonFieldSchema().optional().or(z.literal('')),
  homeState: commonFieldSchema().optional().or(z.literal('')),
  homeZip: commonFieldSchema().optional().or(z.literal('')),
  isPermanentAddress: commonFieldSchema().optional().or(z.literal('')),
  permAddress: commonFieldSchema().optional().or(z.literal('')),
  permCity: commonFieldSchema().optional().or(z.literal('')),
  permState: commonFieldSchema().optional().or(z.literal('')),
  permZip: commonFieldSchema().optional().or(z.literal('')),
  permCountry: commonFieldSchema().optional().or(z.literal('')),
  homePhone: commonFieldSchema().optional().or(z.literal('')),
  mobilePhone: commonFieldSchema().optional().or(z.literal('')),
  homeEmail: commonFieldSchema().optional().or(z.literal('')),

  // Family Information fields
  fatherName: commonFieldSchema().optional().or(z.literal('')),
  fatherBirthCity: commonFieldSchema().optional().or(z.literal('')),
  fatherBirthState: commonFieldSchema().optional().or(z.literal('')),
  fatherBirthCountry: commonFieldSchema().optional().or(z.literal('')),
  fatherCitizenship: commonFieldSchema().optional().or(z.literal('')),
  fatherPrevCitizenship: commonFieldSchema().optional().or(z.literal('')),
  motherName: commonFieldSchema().optional().or(z.literal('')),
  motherBirthCity: commonFieldSchema().optional().or(z.literal('')),
  motherBirthState: commonFieldSchema().optional().or(z.literal('')),
  motherBirthCountry: commonFieldSchema().optional().or(z.literal('')),
  motherCitizenship: commonFieldSchema().optional().or(z.literal('')),
  motherPrevCitizenship: commonFieldSchema().optional().or(z.literal('')),
  maritalStatus: commonFieldSchema().optional().or(z.literal('')),
  spouseName: commonFieldSchema().optional().or(z.literal('')),
  spouseCitizenship: commonFieldSchema().optional().or(z.literal('')),
  spousePrevCitizenship: commonFieldSchema().optional().or(z.literal('')),
  spouseBirthCity: commonFieldSchema().optional().or(z.literal('')),
  spouseBirthState: commonFieldSchema().optional().or(z.literal('')),
  spouseBirthCountry: commonFieldSchema().optional().or(z.literal('')),
  grandparentsPakistan: commonFieldSchema().optional().or(z.literal('')),
  grandparentsPakistanDetails: commonFieldSchema().optional().or(z.literal('')),

  // Work/School Information fields
  occupation: commonFieldSchema().optional().or(z.literal('')),
  jobTitle: commonFieldSchema().optional().or(z.literal('')),
  employerOrSchool: commonFieldSchema().optional().or(z.literal('')),
  workAddress: commonFieldSchema().optional().or(z.literal('')),
  workCity: commonFieldSchema().optional().or(z.literal('')),
  workState: commonFieldSchema().optional().or(z.literal('')),
  workZip: commonFieldSchema().optional().or(z.literal('')),
  workPhone: commonFieldSchema().optional().or(z.literal('')),
  workEmail: commonFieldSchema().optional().or(z.literal('')),
  previousOccupation: commonFieldSchema().optional().or(z.literal('')),
  militaryService: commonFieldSchema().optional().or(z.literal('')),
  militaryCountryBranch: commonFieldSchema().optional().or(z.literal('')),
  militarySpecialization: commonFieldSchema().optional().or(z.literal('')),
  militaryHighestRank: commonFieldSchema().optional().or(z.literal('')),
  militaryCity: commonFieldSchema().optional().or(z.literal('')),
  militaryState: commonFieldSchema().optional().or(z.literal('')),
  militaryCountry: commonFieldSchema().optional().or(z.literal('')),

  // Travel to India fields
  visaType: commonFieldSchema().optional().or(z.literal('')),
  expectedArrivalDate: commonFieldSchema().optional().or(z.literal('')),
  arrivalCity: commonFieldSchema().optional().or(z.literal('')),
  exitCity: commonFieldSchema().optional().or(z.literal('')),
  otherIndianCities: commonFieldSchema().optional().or(z.literal('')),
  purposeOfVisit: commonFieldSchema().optional().or(z.literal('')),
  previousVisitToIndia: commonFieldSchema().optional().or(z.literal('')),
  prevHotelAddress: commonFieldSchema().optional().or(z.literal('')),
  prevCitiesVisited: commonFieldSchema().optional().or(z.literal('')),
  prevVisaNumber: commonFieldSchema().optional().or(z.literal('')),
  prevVisaIssuedBy: commonFieldSchema().optional().or(z.literal('')),
  prevVisaType: commonFieldSchema().optional().or(z.literal('')),
  prevVisaIssuedDate: commonFieldSchema().optional().or(z.literal('')),
  visaRefused: commonFieldSchema().optional().or(z.literal('')),
  visaRefusalDetails: commonFieldSchema().optional().or(z.literal('')),
  countriesVisited10Years: commonFieldSchema().optional().or(z.literal('')),

  // Reference in India fields
  refIndiaName: commonFieldSchema().optional().or(z.literal('')),
  refIndiaCompany: commonFieldSchema().optional().or(z.literal('')),
  refIndiaAddress1: commonFieldSchema().optional().or(z.literal('')),
  refIndiaAddress2: commonFieldSchema().optional().or(z.literal('')),
  refIndiaPhone: commonFieldSchema().optional().or(z.literal('')),
  refIndiaEmail: commonFieldSchema().optional().or(z.literal('')),

  // Reference in USA fields
  refUSAName: commonFieldSchema().optional().or(z.literal('')),
  refUSACompany: commonFieldSchema().optional().or(z.literal('')),
  refUSAAddress: commonFieldSchema().optional().or(z.literal('')),
  refUSACity: commonFieldSchema().optional().or(z.literal('')),
  refUSAState: commonFieldSchema().optional().or(z.literal('')),
  refUSAZip: commonFieldSchema().optional().or(z.literal('')),
  refUSAPhone: commonFieldSchema().optional().or(z.literal('')),
  refUSAEmail: commonFieldSchema().optional().or(z.literal('')),

  // Additional Questions fields
  refusedEntryDeported: commonFieldSchema().optional().or(z.literal('')),
  refusedEntryDetails: commonFieldSchema().optional().or(z.literal('')),
  everArrested: commonFieldSchema().optional().or(z.literal('')),
  arrestedDetails: commonFieldSchema().optional().or(z.literal('')),
  everConvicted: commonFieldSchema().optional().or(z.literal('')),
  convictedDetails: commonFieldSchema().optional().or(z.literal('')),

  // Additional service fields
  additionalServiceFields: z
    .object({
      paymentMethod: commonFieldSchema().optional().or(z.literal('')),
      paymentStatus: commonFieldSchema().optional().or(z.literal('')),
      totalAmount: commonFieldSchema().optional().or(z.literal('')),
      paidAmount: commonFieldSchema().optional().or(z.literal('')),
      paymentId: commonFieldSchema().optional().or(z.literal('')),
      courierId: commonFieldSchema().optional().or(z.literal('')),
      passportNumber: commonFieldSchema().optional().or(z.literal('')),
    })
    .optional()
    .or(z.literal('')),
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
