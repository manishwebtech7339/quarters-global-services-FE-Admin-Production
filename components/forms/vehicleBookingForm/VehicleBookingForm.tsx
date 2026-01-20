'use client';
import React, { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BookingDataType, UserTypeENUM } from '@/lib/types';
import { fetcher } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';
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
import { toast } from 'sonner';
import { FormCombobox } from '@/components/common/FormComboBox';
import { PhoneInput2 } from '@/components/ui/PhoneInput2';
import { Autocomplete } from '@react-google-maps/api';
import { addDays, format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
export const vehicleList = [
  { id: 'sedan', name: 'Sedan' },
  { id: 'mid-suv', name: 'Mid Size SUV' },
  { id: 'mini-van', name: 'Mini Van' },
  { id: '15-seater', name: '15 Seater' },
  { id: 'shuttle-bus', name: 'Shuttle Bus' },
  { id: 'charter-bus', name: 'Charter Bus' },
  {
    id: 'large-suv',
    name: 'Large SUV',
  },
] as const;
const formSchema = z.object({
  // fullName: z.string().min(1, 'Full Name is required'),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  agent: z.string().optional(),
  email: z
    .string()
    .email('Invalid email')
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Email must be lowercase and valid'),
  countryCode: z.string().min(1, 'Country code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  pickupLocation: z.string().min(1, 'Pickup Location is required'),
  dropOffLocation: z.string().min(1, 'Drop-off Location is required'),
  pickupDate: z.string().min(1, 'Pick-up Date is required'), // z.date() if you're handling date objects
  dropDate: z.string().min(1, 'Drop Date is required'),

  customerSelectedVehicleInfo: z.string().min(1, 'Type is required'),
  assignedVehicle: z.string().min(1, 'Assigned Vehicle is required'),
  assignedDriver: z.string().min(1, 'Assigned Driver is required'),
  tripPurpose: z.string().min(1, 'Trip Purpose is required'),
  numberOfPassengers: z.string().min(1, 'Number of Passengers is required'),
  // destination: z.string().min(1, 'Destination is required'),
  approxKilometer: z.string().min(1, 'Approx. Kilometer is required'),
  estimatedFare: z.string().min(1, 'Estimated Fare is required'),
  paymentStatus: z.string(), // Can be any string from API
  bookingStatus: z.string(), // Can be any string from API
  paymentType: z.string(),
  note: z.string().optional(),
});

const VehicleBookingForm = ({
  bookingData,
  isView = false,
  isEdit = false,
  vehicles = [],
  drivers = [],
  role,
}: {
  bookingData?: BookingDataType;
  isView?: boolean;
  isEdit?: boolean;
  vehicles?: any[];
  drivers?: any[];
  role?: UserTypeENUM;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  console.log(bookingData, 'Booking Data in Form');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: bookingData?.firstName || '',
      lastName: bookingData?.lastName || '',
      agent: bookingData?.agent || '',
      email: bookingData?.email || '',
      countryCode: bookingData?.countryCode || '',
      phone: bookingData?.phone || '',
      pickupLocation: bookingData?.pickupLocation || '',
      dropOffLocation: bookingData?.dropLocation || '',
      pickupDate: bookingData?.pickupDate
        ? format(new Date(bookingData.pickupDate), "yyyy-MM-dd'T'HH:mm")
        : '',
      dropDate: bookingData?.dropDate
        ? format(new Date(bookingData.dropDate), "yyyy-MM-dd'T'HH:mm")
        : '',

      customerSelectedVehicleInfo: bookingData?.customerSelectedVehicleInfo || '',
      assignedVehicle: bookingData?.assignedVehicle || '',
      assignedDriver: bookingData?.assignedDriver || '',
      tripPurpose: bookingData?.tripPurpose || '',
      numberOfPassengers: bookingData?.numberOfPassanger || '0',
      // destination: bookingData?.destination || '',
      approxKilometer: bookingData?.approxKilometer || '0',
      estimatedFare: bookingData?.estFare || '0',
      paymentStatus: bookingData?.paymentStatus || 'Unpaid',
      paymentType: bookingData?.paymentType || 'Pending',
      bookingStatus: bookingData?.bookingStatus || 'Pending',
      note: bookingData?.note || '',
    },
  });
  console.log(form.formState.errors);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted with values:', values);
    setIsLoading(true);
    try {
      const payload = {
        agent: values.agent,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        countryCode: values.countryCode,
        phone: values.phone,
        amount: parseInt(values.estimatedFare) || 0,
        pickupLocation: values.pickupLocation,
        dropLocation: values.dropOffLocation,
        pickupDate: values.pickupDate,
        dropDate: values.dropDate,
        customerSelectedVehicleInfo: values.customerSelectedVehicleInfo,
        assignedVehicle: values.assignedVehicle,
        assignedDriver: values.assignedDriver,
        tripPurpose: values.tripPurpose,
        numberOfPassanger: values.numberOfPassengers,
        // destination: values.destination,
        approxKilometer: values.approxKilometer,
        estFare: values.estimatedFare,
        paymentStatus: values.paymentStatus,
        bookingStatus: values.bookingStatus,
        note: values.note,
        paymentType: values.paymentType,
      };

      let response;
      if (isEdit && bookingData?._id) {
        response = await fetcher(`/vehicle/booking/update/${bookingData._id}`, {
          method: 'PUT',
          body: payload,
        });
      } else {
        response = await fetcher('/vehicle/booking/create', {
          method: 'POST',
          body: payload,
        });
      }
      toast.success(`Booking ${isEdit ? 'updated' : 'created'} successful`);
      if (response?.status) {
        role === UserTypeENUM.AGENT
          ? router.push('/agent/vehicles/vehicles-bookings')
          : router.push('/admin/vehicles/vehicles-bookings');
      } else {
        console.error('Booking operation failed:', response);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log('Form validation errors:', errors);
        })}
        className="space-y-4"
      >
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          {isView && <p className=" font-semibold col-span-2 border-b pb-2">Booking Details</p>}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
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
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Name(Optional)</FormLabel>
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
                  <Input type="email" placeholder="" disabled={isView || isEdit} {...field} />
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
                  {/* <PhoneInput placeholder="" disabled={isView} {...field} /> */}
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
            name="pickupLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pickup Location</FormLabel>
                <FormControl>
                  <Autocomplete
                    onLoad={(autocomplete: any) => {
                      autocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={() => {
                      const place = autocompleteRef.current?.getPlace();
                      if (!place?.address_components) return;

                      field.onChange(place.formatted_address || '');
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
            name="dropOffLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drop off Location</FormLabel>
                <FormControl>
                  <Autocomplete
                    onLoad={(autocomplete: any) => {
                      autocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={() => {
                      const place = autocompleteRef.current?.getPlace();
                      if (!place?.address_components) return;

                      field.onChange(place.formatted_address || '');
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
            name="pickupDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pickup Date</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    placeholder=""
                    disabled={isView}
                    {...field}
                    min={format(bookingData?.pickupDate ?? new Date(), "yyyy-MM-dd'T'HH:mm")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dropDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drop Date</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    placeholder=""
                    disabled={isView}
                    {...field}
                    min={
                      form.watch('pickupDate')
                        ? format(addDays(form.watch('pickupDate'), 1), "yyyy-MM-dd'T'HH:mm")
                        : ''
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="vehicleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isView}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="customerSelectedVehicleInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Selected Vehicle</FormLabel>
                <Select
                  onValueChange={(e) => {
                    field.onChange(e);
                    form.setValue('assignedVehicle', '');
                  }}
                  defaultValue={field.value}
                  disabled={isView}
                >
                  <FormControl>
                    <SelectTrigger disabled={isEdit} className="w-full">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleList.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.name}>
                        {vehicle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="assignedVehicle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Vehicle</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isView}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicles.map((vehicle: any) => (
                      <SelectItem key={vehicle._id} value={vehicle._id}>
                        {vehicle.vehicleName} - {vehicle.licensePlateNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormCombobox
            control={form.control}
            name="assignedVehicle"
            label="Assigned Vehicle"
            apiUrl={`/vehicle/list?status=active`}
            initialOptions={vehicles}
            formatLabel={(item) => `${item.vehicleName ?? ''} (${item.licensePlateNumber ?? ''})`}
          />

          <FormCombobox
            control={form.control}
            name="assignedDriver"
            label="Assigned Driver"
            apiUrl={`/vehicle/driver/list?status=active`}
            initialOptions={drivers}
            formatLabel={(item) => `${item.fullName ?? ''}  (${item.licenseNumber ?? ''})`}
          />

          <FormField
            control={form.control}
            name="tripPurpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Purpose</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numberOfPassengers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Passengers</FormLabel>

                <FormControl>
                  {/* <SelectTrigger className="w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger> */}
                  <Input {...field} />
                </FormControl>
                {/* <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7+</SelectItem>
                  </SelectContent> */}

                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="approxKilometer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approx Kilometer</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedFare"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Est. Fare</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isView}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isView}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bookingStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Booking Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isView}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isView}>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </Select>

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

export default VehicleBookingForm;
