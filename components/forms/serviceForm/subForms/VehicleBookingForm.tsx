'use client';

// Bro Done

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { useRouter } from 'next/navigation';
import handleAsync from '@/lib/handleAsync';
import { createApplication, editApplication } from '@/services/applicatonService';
import { toast } from 'sonner';
import { PhoneInput2 } from '@/components/ui/PhoneInput2';
import { otherServices_platformServiceId } from '@/lib/staticIds';
import { getDriverList } from '@/services/vehicleservice';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApplicationSource } from '@/lib/types';
import { commonFieldSchema } from '@/lib/formSchemaFunctions';

const vehicleTypes = ['Sedan', 'SUV', 'Van', 'Bus'];
const purposes = ['Business', 'Tourism', 'Airport Transfer', 'Other'];

const formSchema = z.object({
  vehicleType: commonFieldSchema(),
  firstName: commonFieldSchema(),
  lastName: commonFieldSchema(),
  email: commonFieldSchema(),
  phone: commonFieldSchema(),
  countryCode: commonFieldSchema(),
  numberOfPassengers: commonFieldSchema(),
  pickUpDate: commonFieldSchema(),
  dropDate: commonFieldSchema(),
  pickupLocation: commonFieldSchema(),
  dropOffLocation: commonFieldSchema(),
  purpose: commonFieldSchema(),
  preferredDriver: commonFieldSchema(),
});

const VehicleBookingForm = ({
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickUpDate: undefined,
      dropDate: undefined,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [drivers, setDrivers] = useState<{ label: string; value: string }[]>([]);
  const [driverSearch, setDriverSearch] = useState('');
  const [driverSearchLoading, setDriverSearchLoading] = useState(false);

  const onSubmit = handleAsync(async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // document
      const document = '';
      // if (document instanceof File) {
      //   const uploadedUrl = await uploadFile(document, `application-${document.name}`);
      //   if (!uploadedUrl) {
      //     throw new Error(`Failed to upload document`);
      //   }
      //   document = {
      //     fileName: document.name,
      //     mimeType: document.type,
      //     file: uploadedUrl,
      //   };
      // }

      // Application data
      const applicationPayload = {
        // Compulsory fields for application and also for create user
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        countryCode: values.countryCode,
        phone: values.phone,
        isSubmittedFromService: true,
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
        // Also all dynamic service fields will come in serviceFields key. so in edit we can use them as it is also have all fields access
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
  console.log(defaultData, 'DefaultData');
  // Form default values
  React.useEffect(() => {
    if (defaultData) {
      form.reset({
        ...defaultData.serviceFields,
      });

      // Load driver label in edit case
      if (defaultData?.serviceFields?.preferredDriver) {
        setDriverSearch(defaultData?.serviceFields?.preferredDriver);
      }
    }
  }, [defaultData]);

  // Fetch drivers with debounce
  React.useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setDriverSearchLoading(true);

      try {
        const res = await getDriverList({
          page: '1',
          search: driverSearch || '',
        });

        const formatted = res?.data?.map((d: any) => ({
          label: d.fullName,
          value: d._id,
        }));

        setDrivers(formatted || []);
      } catch (error) {
        console.error('Driver fetch failed:', error);
        setDrivers([]);
      } finally {
        setDriverSearchLoading(false);
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(delayDebounce);
  }, [driverSearch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4 items-start">
          {isView && (
            <p className="font-semibold col-span-2 border-b pb-2">Vehicle Booking Details</p>
          )}

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input type="email" {...field} />
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
                    disabled={isView}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vehicle Type */}
          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Passengers */}
          <FormField
            control={form.control}
            name="numberOfPassengers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Passengers</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pick-up Date */}
          <FormField
            control={form.control}
            name="pickUpDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pick-up Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Drop Date */}
          <FormField
            control={form.control}
            name="dropDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drop Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" min={form.watch('pickUpDate')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pickup Location */}
          <FormField
            control={form.control}
            name="pickupLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pickup Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Drop off Location */}
          <FormField
            control={form.control}
            name="dropOffLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drop off Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Purpose */}
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {purposes.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Preferred Driver */}
          <FormField
            control={form.control}
            name="preferredDriver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        disabled={driverSearchLoading}
                        variant="outline"
                        role="combobox"
                        className="w-full h-12 justify-between"
                      >
                        {form.watch('preferredDriver')
                          ? drivers.find(
                              (framework) => framework.value === form.watch('preferredDriver'),
                            )?.label
                          : 'Select driver'}
                        {driverSearchLoading ? (
                          <Loader className="opacity-50 animate-spin" />
                        ) : (
                          <ChevronsUpDown className="opacity-50" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search driver..."
                          className="h-9"
                          onValueChange={(text) => setDriverSearch(text)}
                        />
                        <CommandList>
                          <CommandEmpty>No driver found.</CommandEmpty>
                          <CommandGroup>
                            {drivers.map((framework) => (
                              <CommandItem
                                key={framework.value}
                                value={framework.value}
                                onSelect={(currentValue) => {
                                  form.setValue('preferredDriver', currentValue, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                {framework.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    form.watch('preferredDriver') === framework.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormDescription>Choose the driver for the trip.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            disabled={isLoading}
            onClick={() => router.back()}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          {!isView && (
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default VehicleBookingForm;
