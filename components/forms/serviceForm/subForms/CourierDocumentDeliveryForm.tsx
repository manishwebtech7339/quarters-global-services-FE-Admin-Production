'use client';
import React, { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Autocomplete } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FileInput } from '@/components/ui/file-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import handleAsync from '@/lib/handleAsync';
import { toast } from 'sonner';
import { createApplication, editApplication } from '@/services/applicatonService';
import { PhoneInput2 } from '@/components/ui/PhoneInput2';
import { uploadFile } from '@/lib/uploadUtils';
import { otherServices_platformServiceId } from '@/lib/staticIds';
import { ApplicationSource } from '@/lib/types';
import { commonFieldSchema, emailSchema, phoneNumberSchema } from '@/lib/formSchemaFunctions';

const formSchema = z.object({
  senderFirstName: commonFieldSchema(),
  senderLastName: commonFieldSchema(),
  senderEmail: emailSchema(),
  senderPhone: phoneNumberSchema(),
  senderCountryCode: commonFieldSchema(),
  senderAddress: commonFieldSchema(),
  senderCity: commonFieldSchema(),
  senderState: commonFieldSchema(),
  senderCountry: commonFieldSchema(),

  recipientName: commonFieldSchema(),
  recipientPhone: phoneNumberSchema(),
  recipientAddress: commonFieldSchema(),
  recipientCity: commonFieldSchema(),
  recipientState: commonFieldSchema(),
  recipientCountry: commonFieldSchema(),

  deliveryType: commonFieldSchema(),
  preferredCourier: commonFieldSchema(),
  pagesOrEnvelopes: commonFieldSchema(),
  trackingNumber: commonFieldSchema(),

  documents: z.any().optional(),
});

const CourierDocumentDeliveryForm = ({
  isView,
  platformServiceId,
  platformServiceCategoryPackageId,
  defaultData,
  applicationSource = 'AdminPortal',
}: {
  applicationSource?: ApplicationSource;
  isView?: boolean;
  platformServiceId?: string;
  platformServiceCategoryPackageId?: string;
  defaultData?: any;
}) => {
  const router = useRouter();
  const senderAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const recipientAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = handleAsync(async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      let document = values.documents ?? '';
      if (document instanceof File) {
        const uploadedUrl = await uploadFile(document, `application-${document.name}`);
        if (!uploadedUrl) {
          throw new Error('Failed to upload document');
        }
        document = {
          fileName: document.name,
          mimeType: document.type,
          file: uploadedUrl,
        };
      }

      const applicationPayload = {
        email: values.senderEmail,
        firstName: values.senderFirstName,
        lastName: values.senderLastName,
        countryCode: values.senderCountryCode,
        isSubmittedFromService: true,
        phone: values.senderPhone,
        applicationSource: defaultData?.applicationSource ?? applicationSource,
        status: 'Submitted',
        description: '',
        address: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
        currentLegalAddress: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
        toCountryId: null,
        platformServices: [
          {
            platformServiceId: otherServices_platformServiceId,
            platformServiceCategoryId: platformServiceId,
            platformServiceCategoryPackageId,
          },
        ],
        serviceFields: { ...values, documents: document },
      };

      if (defaultData) {
        await editApplication({ id: defaultData._id, ...applicationPayload });
        toast.success('Application updated successfully!');
      } else {
        await createApplication({
          applications: [applicationPayload],
        });
        toast.success('Application submitted successfully!');
      }

      form.reset();
      if (applicationSource === 'AgentPortal') {
        router.push('/agent/services');
      } else {
        router.push('/admin/services');
      }
    } catch (error) {
      toast.error('Failed to submit Application. Please try again.');
      console.error('Application creation error:', error);
    } finally {
      setIsLoading(false);
    }
  });

  React.useEffect(() => {
    if (defaultData) {
      setTimeout(() => {
        form.reset({
          ...defaultData.serviceFields,
        });
      }, 100);
    }
  }, [defaultData, form]);

  const handleAddressSelect = (
    autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>,
    fieldName: 'senderAddress' | 'recipientAddress',
    cityField: 'senderCity' | 'recipientCity',
    stateField: 'senderState' | 'recipientState',
    countryField: 'senderCountry' | 'recipientCountry',
  ) => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.address_components) return;

    let addressLine = '';
    let city = '';
    let state = '';
    let country = '';

    let streetNumber = '';
    let route = '';
    let sublocality = '';
    let premise = '';

    place.address_components.forEach((component) => {
      const types = component.types;

      if (types.includes('street_number')) {
        streetNumber = component.long_name;
      }

      if (types.includes('route')) {
        route = component.long_name;
      }

      if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
        sublocality = component.long_name;
      }

      if (types.includes('premise')) {
        premise = component.long_name;
      }

      if (types.includes('locality')) {
        city = component.long_name;
      }

      if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }

      if (types.includes('country')) {
        country = component.long_name;
      }
    });

    addressLine = [premise, streetNumber, route, sublocality].filter(Boolean).join(', ');

    form.setValue(fieldName, addressLine || place.formatted_address || '', {
      shouldValidate: true,
    });
    form.setValue(cityField, city, { shouldValidate: true });
    form.setValue(stateField, state, { shouldValidate: true });
    form.setValue(countryField, country, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isView && <p className="border-b pb-2 font-semibold">Courier Document Delivery Details</p>}

        <div className="space-y-6">
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-4 border-b pb-3">
              <h3 className="text-base font-semibold">Sender Details</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="senderFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Phone</FormLabel>
                    <FormControl>
                      <PhoneInput2
                        value={field.value}
                        onChange={(val, df) => {
                          field.onChange(val ? `+${val}` : '');
                          form.setValue('senderCountryCode', `+${df.dialCode || ''}`);
                        }}
                        disabled={isView}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Address</FormLabel>
                    <FormControl>
                      <Autocomplete
                        onLoad={(autocomplete: google.maps.places.Autocomplete) => {
                          senderAutocompleteRef.current = autocomplete;
                        }}
                        onPlaceChanged={() =>
                          handleAddressSelect(
                            senderAutocompleteRef,
                            'senderAddress',
                            'senderCity',
                            'senderState',
                            'senderCountry',
                          )
                        }
                      >
                        <Input {...field} autoComplete="off" disabled={isView} placeholder="" />
                      </Autocomplete>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-4 border-b pb-3">
              <h3 className="text-base font-semibold">Receiver Details</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Phone</FormLabel>
                    <FormControl>
                      <PhoneInput2
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val ? `+${val}` : '');
                        }}
                        disabled={isView}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Address</FormLabel>
                    <FormControl>
                      <Autocomplete
                        onLoad={(autocomplete: google.maps.places.Autocomplete) => {
                          recipientAutocompleteRef.current = autocomplete;
                        }}
                        onPlaceChanged={() =>
                          handleAddressSelect(
                            recipientAutocompleteRef,
                            'recipientAddress',
                            'recipientCity',
                            'recipientState',
                            'recipientCountry',
                          )
                        }
                      >
                        <Input {...field} autoComplete="off" disabled={isView} placeholder="" />
                      </Autocomplete>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="deliveryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Type</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Express">Express</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pagesOrEnvelopes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. of Pages or Envelopes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredCourier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Courier Company</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DHL">DHL</SelectItem>
                          <SelectItem value="FedEx">FedEx</SelectItem>
                          <SelectItem value="UPS">UPS</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trackingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracking Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="documents"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Upload Document</FormLabel>
                    <FormControl>
                      <FileInput
                        ref={field.ref}
                        disabled={isView}
                        onFileChange={field.onChange}
                        selectedFileValue={field.value instanceof File ? field.value : null}
                        existingFileUrl={field?.value?.file || ''}
                        existingFileName={field?.value?.fileName || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={() => router.back()}
            type="button"
            variant="outline"
            disabled={isLoading}
          >
            Cancel
          </Button>
          {!isView && (
            <Button type="submit" disabled={isLoading}>
              Save
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CourierDocumentDeliveryForm;
