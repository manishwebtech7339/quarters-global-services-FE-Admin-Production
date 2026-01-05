'use client';
import React, { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { fetcher } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';
import { uploadFile } from '@/lib/uploadUtils';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileInput } from '@/components/ui/file-input';
import { toast } from 'sonner';
import { UserTypeENUM } from '@/lib/types';
import { PhoneInput2 } from '@/components/ui/PhoneInput2';
import { format } from 'date-fns';
import { Autocomplete } from '@react-google-maps/api';

const formSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Invalid email'),
  countryCode: z.string().min(1, 'Country code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pinCode: z.string().min(1, 'Pin code is required'),
  licenseNumber: z.string().min(1, 'License Number is required'),
  licenseExpiryDate: z.string().min(1, 'License Expiry Date is required'),
  status: z.enum(['Available', 'Not Available']),
  photo: z.any().optional(),
  licence: z.any().optional(), // Note: API uses 'licence' not 'license'
});

interface DriverFormProps {
  isView?: boolean;
  isEdit?: boolean;
  driverData?: any; // We'll use any for now since the API structure might differ from DriverDataType
  role?: UserTypeENUM;
}

const AddDriverForm = ({ isView, isEdit, driverData, role }: DriverFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: driverData?.fullName || '',
      email: driverData?.email || '',
      countryCode: driverData?.countryCode || '',
      phone: driverData?.phone || '',
      address: driverData?.address || '',
      city: driverData?.city || '',
      state: driverData?.state || '',
      pinCode: driverData?.pinCode || '',
      licenseNumber: driverData?.licenseNumber || '',
      licenseExpiryDate: driverData?.licenseExpiryDate
        ? driverData.licenseExpiryDate.split('T')[0]
        : '',
      status: driverData?.status || 'Available', // Default status
      photo: driverData?.photo || null,
      licence: driverData?.licence || null,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form Values:', values);
    try {
      setIsLoading(true);

      let photoData = driverData?.photo || null;
      let licenceData = driverData?.licence || null;

      // Step 1: Upload files if they are new File objects and create document objects
      if (values.photo instanceof File) {
        console.log('Uploading driver photo...');
        const uploadedUrl = await uploadFile(values.photo, 'driver-photo');
        if (!uploadedUrl) {
          throw new Error('Failed to upload driver photo');
        }
        photoData = {
          file: uploadedUrl,
          fileName: values.photo.name,
          mimeType: values.photo.type,
        };
      }

      if (values.licence instanceof File) {
        console.log('Uploading license document...');
        const uploadedUrl = await uploadFile(values.licence, 'driver-license');
        if (!uploadedUrl) {
          throw new Error('Failed to upload license document');
        }
        licenceData = {
          file: uploadedUrl,
          fileName: values.licence.name,
          mimeType: values.licence.type,
        };
      }

      // Step 2: Prepare the payload with document objects
      const payload = {
        fullName: values.fullName,
        email: values.email,
        countryCode: values.countryCode,
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        pinCode: values.pinCode,
        licenseNumber: values.licenseNumber,
        licenseExpiryDate: values.licenseExpiryDate,
        photo: photoData ?? undefined,
        licence: licenceData ?? undefined,
        status: values.status,
      };

      let response;
      if (isEdit && driverData?._id) {
        // Update existing driver
        response = await fetcher(`/vehicle/driver/update/${driverData._id}`, {
          method: 'PUT',
          body: payload,
        });
        console.log('Driver updated successfully:', response);
        toast.success('Driver Updated Successfully');
      } else {
        // Create new driver
        response = await fetcher('/vehicle/driver/create', {
          method: 'POST',
          body: payload,
        });
        console.log('Driver created successfully:', response);
        toast.success('Driver Created Successfully');
      }

      // Redirect to driver list or show success message
      role === UserTypeENUM.AGENT
        ? router.push('/agent/vehicles/driver-management')
        : router.push('/admin/vehicles/driver-management');
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} driver:`, error);
      // You can add toast notification here
      toast.error('Error Uploading Driver');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          {isView && <p className=" font-semibold col-span-2 border-b pb-2">Driver Details</p>}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="" disabled={isView} {...field} />
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
                <FormLabel>Phone</FormLabel>
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
          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Number</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="licenseExpiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Expiry Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder=""
                    min={format(new Date(), 'yyyy-MM-dd')}
                    disabled={isView}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isView}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Not Available">Not Available</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          {isView && <p className=" font-semibold col-span-2 border-b pb-2">Address</p>}

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={() => {
                      const place = autocompleteRef.current?.getPlace();
                      if (!place?.address_components) return;

                      let addressLine = '';
                      let city = '';
                      let state = '';
                      let pincode = '';

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

                        if (
                          types.includes('sublocality') ||
                          types.includes('sublocality_level_1')
                        ) {
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

                        if (types.includes('postal_code')) {
                          pincode = component.long_name;
                        }
                      });

                      // Build clean address line (NO city/state/pincode)
                      addressLine = [premise, streetNumber, route, sublocality]
                        .filter(Boolean)
                        .join(', ');

                      form.setValue('address', addressLine);
                      form.setValue('city', city);
                      form.setValue('state', state);
                      form.setValue('pinCode', pincode);
                    }}
                    options={{
                      componentRestrictions: { country: 'in' }, // optional
                    }}
                  >
                    <Input {...field} placeholder="" disabled={isView} />
                  </Autocomplete>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pinCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pin code</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          {isView ? (
            <p className=" font-semibold col-span-2 border-b pb-2">Documents</p>
          ) : (
            <p className="col-span-2">Upload Required Document</p>
          )}{' '}
          <FormField
            control={form.control}
            name="licence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Document</FormLabel>
                <FormControl>
                  <FileInput
                    onFileChange={field.onChange}
                    existingFileUrl={driverData?.licence?.file}
                    existingFileName={driverData?.licence?.fileName}
                    disabled={isView}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver Photo</FormLabel>
                <FormControl>
                  <FileInput
                    onFileChange={field.onChange}
                    existingFileUrl={driverData?.photo?.file}
                    existingFileName={driverData?.photo?.fileName}
                    disabled={isView}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {!isView && (
          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update' : 'Submit'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default AddDriverForm;
