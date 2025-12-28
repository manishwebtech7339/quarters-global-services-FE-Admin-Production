import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  CreateApplicationType,
  getSchemaFields,
  serviceTypes,
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
  passportUSALostStolenDamagedSchema,
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
  emptySchema,
} from './schemas/index'; // organized schemas folder
import { FileInput } from '@/components/ui/file-input';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface DocumentFormProps {
  isView?: boolean;
  selectedCategory?: string;
  existingDocuments?: any;
}

function formatLabel(fieldName: string) {
  return fieldName
    .replace(/([A-Z])/g, ' $1') // split camelCase → camel Case
    .replace(/_/g, ' ') // handle snake_case if any
    .replace(/\b\w/g, (char) => char.toUpperCase()) // capitalize words
    .trim();
}

const DocumentForm = ({ selectedCategory, existingDocuments, isView }: DocumentFormProps) => {
  const form = useFormContext<CreateApplicationType>();
  // Pick the right schema for this category
  const schema = (() => {
    switch (selectedCategory) {
      case serviceTypes['empty']:
        return emptySchema;
      case serviceTypes['b1b2-visitor-visa']:
        return visaUSB1B2Schema;
      case serviceTypes['f1-student-visa']:
        return visaUSStudentSchema;
      case serviceTypes['j1-exchange-visitor-visa']:
        return visaUSExchangeVisitorSchema;
      case serviceTypes['h1b-business-visa']:
        return visaUSBusinessSchema;
      case serviceTypes['h2a-h2b-temporary-worker-visa']:
        return visaUSTemporaryWorkerSchema;
      case serviceTypes['l1-intra-company-transfer']:
        return visaUSIntraCompanyTransferSchema;
      case serviceTypes['o1-extraordinary-ability']:
        return visaUSExtraordinaryAbilitySchema;
      case serviceTypes['p1-p3-athlete-artist-visa']:
        return visaUSAthleteArtistSchema;
      case serviceTypes['r1-religious-worker-visa']:
        return visaUSReligiousWorkerSchema;
      case serviceTypes['tn-td-nafta-visa']:
        return visaUSNAFTASchema;
      case serviceTypes['ir-immediate-relative-visa']:
        return visaUSImmediateRelativeSchema;
      case serviceTypes['f1-f4-family-preference-visa']:
        return visaUSFamilyPreferenceSchema;
      case serviceTypes['eb1-eb5-employment-based-visa']:
        return visaUSEmploymentBasedSchema;
      case serviceTypes['dv-diversity-lottery-visa']:
        return visaUSDiversityLotterySchema;
      case serviceTypes['k1-fiance-visa']:
        return visaUSFianceSchema;
      case serviceTypes['k3-spouse-visa']:
        return visaUSSpouseSchema;
      case serviceTypes['s-witness-informant-visa']:
        return visaUSWitnessInformantSchema;
      case serviceTypes['t-trafficking-victims-visa']:
        return visaUSTraffickingVictimsSchema;
      case serviceTypes['u-crime-victims-visa']:
        return visaUSCrimeVictimsSchema;
      // India Visa Cases
      case serviceTypes['tourist-visa']:
        return visaIndiaTouristSchema;
      case serviceTypes['business-visa']:
        return visaIndiaBusinessSchema;
      case serviceTypes['student-visa']:
        return visaIndiaStudentSchema;
      case serviceTypes['medical-visa']:
        return visaIndiaMedicalSchema;
      case serviceTypes['conference-visa']:
        return visaIndiaConferenceSchema;
      case serviceTypes['employment-visa']:
        return visaIndiaEmploymentSchema;
      // USA Passport Cases
      case serviceTypes['new-passport']:
        return passportUSANewDS11Schema;
      case serviceTypes['usa-passport-renewal-ds82']:
        return passportUSARenewalDS82Schema;
      case serviceTypes['usa-passport-child-under16']:
        return passportUSAChildUnder16Schema;
      case serviceTypes['usa-passport-lost-stolen-damaged']:
        return passportUSALostStolenDamagedSchema;
      case serviceTypes['usa-passport-card']:
        return passportUSACardSchema;
      case serviceTypes['usa-passport-name-change-correction']:
        return passportUSANameChangeCorrectionSchema;
      case serviceTypes['usa-passport-second-valid']:
        return passportUSASecondValidSchema;
      case serviceTypes['usa-passport-expedited-service']:
        return passportUSAExpeditedServiceSchema;
      case serviceTypes['usa-passport-emergency-same-day']:
        return passportUSAEmergencySameDaySchema;
      // India Passport Cases
      case serviceTypes['india-passport-new-adult']:
        return passportIndiaNewAdultSchema;
      case serviceTypes['india-passport-new-minor']:
        return passportIndiaNewMinorSchema;
      case serviceTypes['india-passport-renewal-adult']:
        return passportIndiaRenewalAdultSchema;
      case serviceTypes['india-passport-renewal-minor']:
        return passportIndiaRenewalMinorSchema;
      case serviceTypes['india-passport-lost-damaged']:
        return passportIndiaLostDamagedSchema;
      case serviceTypes['india-passport-tatkal']:
        return passportIndiaTatkalSchema;
      case serviceTypes['india-passport-name-change']:
        return passportIndiaNameChangeSchema;
      // etc…
      default:
        return null;
    }
  })();

  const fields = schema ? getSchemaFields(schema) : [];

  return (
    <>
      {fields.length > 0 ? (
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          <p className="text-base font-semibold text-primary">
            {selectedCategory?.replace(/-/g, ' ').toUpperCase()}
          </p>
          <p className="col-span-2 font-semibold">Documents</p>
          {fields.map((f) => {
            if (f.name === 'serviceType') return null;
            else if (f.type === 'text') {
              return (
                <FormField
                  key={f.name}
                  name={`documents.${f.name}` as any}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {f.name && formatLabel(f.name)}
                        {f.required && <span className="text-red-500 ml-1">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isView} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            } else if (f.type === 'file') {
              return (
                <FormField
                  key={f.name}
                  name={`documents.${f.name}` as any}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {f.name && formatLabel(f.name)}
                        {f.required && <span className="text-red-500 ml-1">*</span>}
                      </FormLabel>
                      <FormControl>
                        <FileInput
                          ref={field.ref}
                          onFileChange={field.onChange}
                          selectedFileValue={field.value instanceof File ? field.value : null}
                          existingFileUrl={
                            // Handle both old object format {file: "url"} and new string format "url"
                            typeof existingDocuments?.[f.name] === 'object'
                              ? existingDocuments?.[f.name]?.file || ''
                              : existingDocuments?.[f.name] || ''
                          }
                          existingFileName={
                            field.value instanceof File ? field?.value?.name : `${f.name}.pdf`
                          }
                          disabled={isView}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
      ) : (
        <div className="p-4 border rounded-lg">
          <p className="text-center text-gray-500">
            Please select service category to view required documents.
          </p>
        </div>
      )}
    </>
  );
};

export default DocumentForm;
