'use client';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import Timeline, { TimelineStep } from '@/components/ui/timeline';
import { Clock } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';

const formSchema = z.object({
  customerName: z.string().min(1, 'Customer Name is required'),
  applicationId: z.string().min(1, 'Application ID is required'),
  email: z
    .string()
    .email('Invalid email address')
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Email must be lowercase and valid'),
  phone: z.string().min(1, 'Phone number is required'),
  pickupAddress: z.string().min(1, 'Pickup Address is required'),
  documentType: z.string().min(1, 'Document Type is required'),
  courierPartner: z.string().min(1, 'Courier Partner is required'),
  courierType: z.string().min(1, 'Courier Type is required'),
  numberOfDocuments: z.number().nonnegative('Must be a non-negative number'),
  pickupDate: z.string().min(1, 'Pickup Date is required'), // Could use z.date() if you handle date conversion
  shipmentWeight: z.number().nonnegative('Weight must be non-negative'),
  dimensions: z.string().min(1, 'Dimensions are required'),
  trackingId: z.string().min(1, 'Tracking ID is required'),
  deliveryEta: z.string().min(1, 'Delivery ETA is required'), // or z.date()
  notes: z.string().optional(),
  insuranceRequired: z.enum(['Yes', 'No']), // Replace with actual dropdown values
  deliveryAddress: z.object({
    address: z.string().min(1, 'Delivery Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().min(1, 'Pincode is required'),
  }),
});

const CourierForm = ({ isView = false }: { isView?: boolean }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      applicationId: '',
      email: '',
      phone: '',
      pickupAddress: '',
      documentType: '',
      courierPartner: '',
      courierType: '',
      numberOfDocuments: 0,
      pickupDate: '',
      shipmentWeight: 0,
      dimensions: '',
      trackingId: '',
      deliveryEta: '',
      notes: '',
      insuranceRequired: 'No',
      deliveryAddress: {
        address: '',
        city: '',
        state: '',
        pincode: '',
      },
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isView) return;
    console.log(values);
  };
  const timelineSteps: TimelineStep[] = [
    {
      id: 'approved',
      title: 'Approved',
      status: 'completed',
      icon: <Clock />,
    },
    {
      id: 'dispatched',
      title: 'Dispatched',
      status: 'active',
      icon: <Clock />,
    },
    {
      id: 'delivered',
      title: 'Delivered',
      status: 'pending',
      icon: <Clock />,
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <Timeline steps={timelineSteps} />
        <p className="text-right mt-1">Last Updated: Today at 12:02 PM</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
            {isView && <p className="col-span-2  border-b pb-2 font-semibold">Courier Details</p>}
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Id</FormLabel>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="" {...field} />
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
                    <PhoneInput placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pickupAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Address</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courierPartner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courier Partner</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courierType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courier Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfDocuments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number Of Documents</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
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
                    <Input type="date" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipmentWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipment Weight(kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensions</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trackingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracking Id</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryEta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Eta</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insuranceRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Required</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
            {isView && <p className="col-span-2  border-b pb-2 font-semibold">Delivery Address</p>}

            <FormField
              control={form.control}
              name="deliveryAddress.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryAddress.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryAddress.pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pin code</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryAddress.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          /> */}
          </div>
          {!isView && (
            <div className="flex items-center gap-2 justify-end">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
              <Button type="reset">Create Pickup</Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default CourierForm;
