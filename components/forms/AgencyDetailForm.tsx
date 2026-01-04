import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Country, State, City } from 'country-state-city';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { commonFieldSchema, documentFileSchema, emailSchema } from '@/lib/formSchemaFunctions';
import { FileInput } from '../ui/file-input';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { safeUpload } from '@/lib/uploadUtils';
import { toast } from 'sonner';
import { AgencyDataType } from '@/lib/types';
import { PhoneInput2 } from '../ui/PhoneInput2';

const formSchema = z.object({
  // Step 1: Agency Details
  email: emailSchema(),
  countryCode: commonFieldSchema(),
  phone: commonFieldSchema(),
  // subAdminRoleId: commonFieldSchema(),
  // password: passwordSchema(),
  agencyName: commonFieldSchema(),
  authorizedRepresentativeName: commonFieldSchema(),
  website: z.string().nonempty({ message: 'Website is required' }),
  businessId: commonFieldSchema(),
  businessType: commonFieldSchema(),
  country: commonFieldSchema(),
  state: commonFieldSchema(),
  city: commonFieldSchema(),
  preferredEmbassyLocation: z
    .string()
    .nonempty({ message: 'Preferred Embassy Location is required' }),

  // Step 2: Document Upload
  governmentBusinessRegistrationCertificate: documentFileSchema(8 * 1024 * 1024, [
    '.jpeg',
    '.jpg',
    '.png',
    '.pdf',
  ]),
  identityProofOfAuthorizedRepresentative: documentFileSchema(8 * 1024 * 1024, [
    '.jpeg',
    '.jpg',
    '.png',
    '.pdf',
  ]),
  authorizationLetter: documentFileSchema(8 * 1024 * 1024, ['.jpeg', '.jpg', '.png', '.pdf']),
  bankStatement: documentFileSchema(8 * 1024 * 1024, ['.jpeg', '.jpg', '.png', '.pdf']),
});

export type AgencyDetailFormSchemaType = z.infer<typeof formSchema>;

interface AgencyDetailFormProps {
  setCurrentStep?: (step: number) => void;
}

const step2Fields = [
  {
    name: 'governmentBusinessRegistrationCertificate',
    label: `Government Business Registration Certificate`,
    required: true,
  },
  {
    name: 'identityProofOfAuthorizedRepresentative',
    label: `Identity Proof of Authorized Representative`,
    required: true,
  },
  {
    name: 'authorizationLetter',
    label: `Authorization Letter`,
    required: true,
  },
  {
    name: 'bankStatement',
    label: `Bank Statement`,
    required: true,
  },
];

const AgencyDetailForm = ({ setCurrentStep: parentSetCurrentStep }: AgencyDetailFormProps) => {
  const email = useSelector((state: RootState) => state.userRegister.email);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  // Safe localStorage access
  const getStoredUser = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('email') || '';
    }
    return '';
  };

  const storedUserEmail = getStoredUser();
  const allCountries = Country.getAllCountries();

  const form = useForm<AgencyDetailFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Step 1: Agency Details
      email: email || storedUserEmail || '',
      phone: '',
      agencyName: '',
      authorizedRepresentativeName: '',
      website: '',
      businessId: '',
      country: '',
      state: '',
      city: '',
      preferredEmbassyLocation: '',
      businessType: '',

      // Step 2: Document Upload
      governmentBusinessRegistrationCertificate: undefined,
      identityProofOfAuthorizedRepresentative: undefined,
      authorizationLetter: undefined,
      bankStatement: undefined,
    },
    mode: 'onChange',
  });

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Validate current step before proceeding
    const step1Fields = [
      'agencyName',
      'authorizedRepresentativeName',
      'businessId',
      'country',
      'state',
      'city',
      'phone',
      'email',
      'website',
      'preferredEmbassyLocation',
      'businessType',
    ] as const;

    form.trigger(step1Fields).then((isValid) => {
      if (isValid) setCurrentStep(2);
    });
  };
  const handleBack = () => {
    setCurrentStep(1);
    form.clearErrors([
      'governmentBusinessRegistrationCertificate',
      'identityProofOfAuthorizedRepresentative',
      'authorizationLetter',
      'bankStatement',
    ]);
  };

  const handleCancel = () => {
    form.reset();
    setCurrentStep(1);
    setSelectedCountry('');
    setSelectedState('');
  };

  const [isUploading, setUploading] = useState(false);

  const handleFile = async (file: any) => {
    // If it's already uploaded (has filename), just return it directly
    if (file?.filename || file?.fileName) return file;

    // Otherwise, upload using your safeUpload utility
    try {
      const uploaded = await safeUpload(file);
      return uploaded;
    } catch (err) {
      console.error('File upload failed:', err);
      throw err;
    }
  };

  const onSubmit = async (data: AgencyDetailFormSchemaType) => {
    setUploading(true);

    // #### Upload all files in parallel, handle failures ####
    const [
      uploadedGovernmentBusinessRegistrationCertificate,
      uploadedIdentityProofOfRepresentative,
      uploadedAuthorizationLetter,
      uploadedBankStatement,
    ] = await Promise.all([
      handleFile(data.governmentBusinessRegistrationCertificate),
      handleFile(data.identityProofOfAuthorizedRepresentative),
      handleFile(data.authorizationLetter),
      handleFile(data.bankStatement),
    ]);

    try {
      // #### Perform explicit null checks for each uploaded file ####
      if (
        !uploadedGovernmentBusinessRegistrationCertificate ||
        !uploadedIdentityProofOfRepresentative ||
        !uploadedAuthorizationLetter ||
        !uploadedBankStatement
      ) {
        throw new Error('One or more file uploads failed');
      }
      const formData = {
        name: data.agencyName,
        email: data.email,
        businessType: data.businessType,
        authorizedRepresentativeName: data.authorizedRepresentativeName,
        website: data.website,
        countryCode: data.countryCode,
        phone: data.phone,
        taxIdOrLicense: data.businessId,
        preferredEmbassyLocation: data.preferredEmbassyLocation,
        address: {
          country: data.country,
          state: data.state,
          city: data.city,
        },
        governmentBusinessRegistrationCertificate: {
          file: uploadedGovernmentBusinessRegistrationCertificate.file,
          fileName: uploadedGovernmentBusinessRegistrationCertificate.fileName,
          mimeType: uploadedGovernmentBusinessRegistrationCertificate.mimeType,
          isUsed: uploadedGovernmentBusinessRegistrationCertificate.isUsed,
        },

        identityProofOfRepresentative: {
          file: uploadedIdentityProofOfRepresentative.file,
          fileName: uploadedIdentityProofOfRepresentative.fileName,
          mimeType: uploadedIdentityProofOfRepresentative.mimeType,
          isUsed: uploadedIdentityProofOfRepresentative.isUsed,
        },

        authorizationLetter: {
          file: uploadedAuthorizationLetter.file,
          fileName: uploadedAuthorizationLetter.fileName,
          mimeType: uploadedAuthorizationLetter.mimeType,
          isUsed: uploadedAuthorizationLetter.isUsed,
        },

        bankStatement: {
          file: uploadedBankStatement.file,
          fileName: uploadedBankStatement.fileName,
          mimeType: uploadedBankStatement.mimeType,
          isUsed: uploadedBankStatement.isUsed,
        },
      };

      // #### Create Agency ####
      const isNewUser = sessionStorage.getItem('isNewUser') === 'true';
      let res;
      if (storedUserEmail && isNewUser) {
        res = await fetch(process.env.NEXT_PUBLIC_QUARTUS_API_URL + '/agency/create-agency', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch(
          process.env.NEXT_PUBLIC_QUARTUS_API_URL + '/agency/update-agency-by-email',
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          },
        );
      }

      const resData = await res.json();

      // #### Error while creating agency ####
      if (!resData.status) {
        throw new Error(resData?.message || 'Something went wrong while creating agency');
      }

      // #### Agency created successfully ####
      toast.success(resData?.message, { duration: 4000, position: 'top-center' });
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('isNewUser');
      if (parentSetCurrentStep) parentSetCurrentStep(2);
    } catch (error) {
      console.error('!!! Error submitting agency detail form !!!', error);
      toast.error(
        error instanceof Error ? error?.message : 'Something went wrong while creating agency',
      );
    } finally {
      setUploading(false);
    }
  };

  // get
  const getAgencyByEmail = async (email: string): Promise<AgencyDataType | null> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_QUARTUS_API_URL}/agency/get-agency-by-email/${email}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        },
      );

      if (!res.ok) {
        console.error(`Failed to fetch agency: ${res.status} ${res.statusText}`);
        return null;
      }

      const result = await res.json();
      return result?.data || null; // assuming your API returns { success, data }
    } catch (error) {
      return null;
    }
  };
  useEffect(() => {
    async function run() {
      if (storedUserEmail) {
        const getAgencyData = await getAgencyByEmail(storedUserEmail);
        if (getAgencyData) {
          form.setValue('agencyName', getAgencyData.name || '');
          form.setValue(
            'authorizedRepresentativeName',
            getAgencyData.authorizedRepresentativeName || '',
          );
          form.setValue('website', getAgencyData.website || '');
          form.setValue('businessId', getAgencyData.taxIdOrLicense || '');
          form.setValue('businessType', getAgencyData.businessType || '');
          form.setValue('country', getAgencyData.address?.country || '');
          setSelectedCountry(getAgencyData.address?.country || '');
          form.setValue('state', getAgencyData.address?.state || '');
          setSelectedState(getAgencyData.address?.state || '');
          form.setValue('city', getAgencyData.address?.city || '');
          form.setValue('preferredEmbassyLocation', getAgencyData.preferredEmbassyLocation || '');
          form.setValue('phone', getAgencyData.phone || '');
          form.setValue('countryCode', getAgencyData.countryCode || '');

          // Document files
          form.setValue(
            'governmentBusinessRegistrationCertificate',
            getAgencyData.governmentBusinessRegistrationCertificate || undefined,
          );
          form.setValue(
            'identityProofOfAuthorizedRepresentative',
            getAgencyData.identityProofOfRepresentative || undefined,
          );
          form.setValue('authorizationLetter', getAgencyData.authorizationLetter || undefined);
          form.setValue('bankStatement', getAgencyData.bankStatement || undefined);
        }
      }
    }
    run();
  }, [storedUserEmail]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}
            >
              1
            </div>
            <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}
            >
              2
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <div className="p-4 border rounded-lg space-y-4">
            {/* First section: 2-column grid for main fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="agencyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Agency Name <sup className="text-red-500">*</sup>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorizedRepresentativeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Authorized Representative Name <sup className="text-red-500">*</sup>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input type="url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Agency Tax ID or License Number <sup className="text-red-500">*</sup>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registered Email</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="Enter registered email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Business</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Second section: 3-column grid for location fields */}
            <div className="grid sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="preferredEmbassyLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Embassy Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter preferred embassy location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contact Phone <sup className="text-red-500">*</sup>
                    </FormLabel>
                    <FormControl>
                      <PhoneInput2
                        value={field.value}
                        onChange={(val, df) => {
                          field.onChange(val ? `+${val}` : '');
                          form.setValue('countryCode', `+${df.dialCode || ''}`);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Country <sup className="text-red-500">*</sup>
                    </FormLabel>
                    <Popover open={openCountry} onOpenChange={setOpenCountry}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCountry}
                            className="w-full justify-between"
                          >
                            {field.value
                              ? allCountries.find((country) => country.name === field.value)?.name
                              : 'Select Country...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search country..." />
                          <CommandList>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              {allCountries.map((country) => (
                                <CommandItem
                                  key={country.name}
                                  value={country.name} // Use country name for search
                                  onSelect={() => {
                                    form.setValue('country', country.name, {
                                      shouldValidate: true,
                                    });
                                    setSelectedCountry(country.isoCode);
                                    setSelectedState('');
                                    form.setValue('state', '');
                                    form.setValue('city', '');
                                    setOpenCountry(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value === country.name ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                  {country.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      State <sup className="text-red-500">*</sup>
                    </FormLabel>
                    <Popover open={openState} onOpenChange={setOpenState}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openState}
                            className="w-full justify-between"
                            disabled={!selectedCountry}
                          >
                            {field.value && selectedCountry
                              ? State.getStatesOfCountry(selectedCountry).find(
                                  (state) => state.name === field.value,
                                )?.name
                              : 'Select State...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search state..." />
                          <CommandList>
                            <CommandEmpty>No state found.</CommandEmpty>
                            <CommandGroup>
                              {selectedCountry &&
                                State.getStatesOfCountry(selectedCountry).map((state) => (
                                  <CommandItem
                                    key={state.name}
                                    value={state.name} // Use state name for search
                                    onSelect={() => {
                                      form.setValue('state', state.name, {
                                        shouldValidate: true,
                                      });
                                      setSelectedState(state.isoCode);
                                      form.setValue('city', '');
                                      setOpenState(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        field.value === state.name ? 'opacity-100' : 'opacity-0',
                                      )}
                                    />
                                    {state.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      City <sup className="text-red-500">*</sup>
                    </FormLabel>
                    <Popover open={openCity} onOpenChange={setOpenCity}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCity}
                            className="w-full justify-between"
                            disabled={!selectedState}
                          >
                            {field.value ? field.value : 'Select City...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search city..." />
                          <CommandList>
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup>
                              {selectedCountry &&
                                selectedState &&
                                City.getCitiesOfState(selectedCountry, selectedState).map(
                                  (city) => (
                                    <CommandItem
                                      key={city.name}
                                      value={city.name} // Use city name for search
                                      onSelect={() => {
                                        form.setValue('city', city.name, { shouldValidate: true });
                                        setOpenCity(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === city.name ? 'opacity-100' : 'opacity-0',
                                        )}
                                      />
                                      {city.name}
                                    </CommandItem>
                                  ),
                                )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="p-4 border rounded-lg space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {step2Fields.map((fieldConfig) => (
                <FormField
                  key={fieldConfig.name}
                  control={form.control}
                  name={fieldConfig.name as keyof AgencyDetailFormSchemaType}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {fieldConfig.label}{' '}
                        {fieldConfig.required && <sup className="text-red-500">*</sup>}
                      </FormLabel>
                      <FormControl>
                        <FileInput
                          disabled={isUploading}
                          onFileChange={(file) =>
                            form.setValue(fieldConfig.name as any, file, { shouldValidate: true })
                          }
                          accept=".jpeg,.jpg,.png,.pdf"
                          existingFileUrl={
                            form.getValues(fieldConfig.name as keyof AgencyDetailFormSchemaType)
                              ?.file || ''
                          }
                          existingFileName={
                            form.getValues(fieldConfig.name as keyof AgencyDetailFormSchemaType)
                              ?.name || ''
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-center gap-4 pt-4 pb-6">
          {currentStep === 1 ? (
            <>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={handleBack} disabled={isUploading}>
                Back
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Submit'}
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AgencyDetailForm;
