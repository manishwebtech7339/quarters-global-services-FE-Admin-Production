'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import handleAsync from '@/lib/handleAsync';
import { createApplication } from '@/services/applicatonService';

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
import { PhoneInput2 } from '@/components/ui/PhoneInput2';
import { otherServices_platformServiceId } from '@/lib/staticIds';

const charterTypes = ['Private Jet', 'Helicopter', 'Commercial Charter'];
const passengerNumbers = ['1', '2', '3', '4', '5', '6', '7+'];
const specialRequirements = ['None', 'Wheelchair Access', 'Extra Luggage', 'Special Meals'];
const travelInsuranceOptions = ['Yes', 'No'];
const returnTripOptions = ['Yes', 'No'];
const applicationSources = ['AdminPortal', 'AgentPortal', 'Website'];

const formSchema = z.object({
  charterType: z.string().min(1, 'Charter Type is required'),
  numberOfPassengers: z.string().min(1, 'Number of Passengers is required'),
  date: z.string('Date is required'),
  time: z.string().min(1, 'Time is required'), // You may want to parse time properly or use a time picker component
  passengerName: z.string().min(1, 'Passenger Name is required'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Email must be lowercase and valid'),
  phone: z.string().min(1, 'Phone number is required'),
  countryCode: z.string().optional(),
  applicationSource: z.string().min(1, 'Application Source is required'),
  totalPassenger: z.string().min(1, 'Total Passenger is required'),
  specialRequirements: z.string().min(1, 'Special Requirements is required'),
  travelInsurance: z.string().min(1, 'Travel Insurance selection is required'),
  returnTrip: z.string().min(1, 'Return Trip selection is required'),
});

const FlightCharterServicesForm = ({
  isView,
  charterData,
  isEdit = false,
  platformServiceId,
  packageId,
}: {
  isView?: boolean;
  charterData?: any;
  isEdit?: boolean;
  platformServiceId?: string;
  packageId?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      charterType: charterData?.charterType || '',
      numberOfPassengers: charterData?.numberOfPassengers || '',
      date: charterData?.date || undefined,
      time: charterData?.time || '',
      passengerName: charterData?.passengerName || '',
      email: charterData?.email || '',
      phone: charterData?.phone || '',
      countryCode: charterData?.countryCode || '',
      applicationSource: charterData?.applicationSource || '',
      totalPassenger: charterData?.totalPassenger || '',
      specialRequirements: charterData?.specialRequirements || '',
      travelInsurance: charterData?.travelInsurance || '',
      returnTrip: charterData?.returnTrip || '',
    },
  });

  const onSubmit = handleAsync(async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Use the packageId passed as prop
      const platformServiceCategoryPackageId = packageId || '';
      const serviceId = platformServiceId || 'flight-charter-default-id';

      // Send flight charter data directly - backend accepts any keys
      const applicationPayload = {
        charterType: values.charterType,
        numberOfPassengers: values.numberOfPassengers,
        date: values.date,
        time: values.time,
        passengerName: values.passengerName,
        email: values.email,
        phone: values.phone,
        countryCode: values.countryCode,
        applicationSource: values.applicationSource,
        totalPassenger: values.totalPassenger,
        specialRequirements: values.specialRequirements,
        travelInsurance: values.travelInsurance,
        returnTrip: values.returnTrip,
      };

      await createApplication({
        applications: [applicationPayload],
        platformServices: [
          {
            platformServiceId: otherServices_platformServiceId,
            platformServiceCategoryId: serviceId,
            platformServiceCategoryPackageId,
          },
        ],
      });
      toast.success('Flight charter application created successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to create flight charter application. Please try again.');
      console.error('Flight charter application creation error:', error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {isView && (
            <p className="font-semibold col-span-2 border-b pb-2">
              Flight Charter Services Details
            </p>
          )}

          {/* Charter Type */}
          <FormField
            control={form.control}
            name="charterType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Charter Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select charter type" />
                    </SelectTrigger>
                    <SelectContent>
                      {charterTypes.map((type) => (
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      {passengerNumbers.map((num) => (
                        <SelectItem key={num} value={num}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Passenger Name */}
          <FormField
            control={form.control}
            name="passengerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passenger Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                    disabled={isView}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
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

          {/* Total Passenger */}
          <FormField
            control={form.control}
            name="totalPassenger"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Passenger</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Application Source */}
          <FormField
            control={form.control}
            name="applicationSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Source</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select application source" />
                    </SelectTrigger>
                    <SelectContent>
                      {applicationSources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Special Requirements */}
          <FormField
            control={form.control}
            name="specialRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requirements</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select special requirements" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialRequirements.map((req) => (
                        <SelectItem key={req} value={req}>
                          {req}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Travel Insurance */}
          <FormField
            control={form.control}
            name="travelInsurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel Insurance</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select travel insurance" />
                    </SelectTrigger>
                    <SelectContent>
                      {travelInsuranceOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Return Trip */}
          <FormField
            control={form.control}
            name="returnTrip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Return Trip</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select return trip" />
                    </SelectTrigger>
                    <SelectContent>
                      {returnTripOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!isView && (
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Save'}
            </Button>
            <Button type="button" onClick={() => form.reset()} disabled={isLoading}>
              Start New Application
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default FlightCharterServicesForm;
