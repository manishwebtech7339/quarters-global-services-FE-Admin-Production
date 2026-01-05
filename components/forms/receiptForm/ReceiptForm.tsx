'use client';

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
import { Checkbox } from '@/components/ui/checkbox';
import { PhoneInput } from '@/components/ui/phone-input';

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z
    .string()
    .email()
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Email must be lowercase and valid'),
  phone: z.string().min(1),
  serviceCategory: z.string().min(1),
  miscService: z.string().optional(),

  document1: z.string().optional(),
  document1No: z.string().optional(),
  document2: z.string().optional(),
  document2No: z.string().optional(),
  document3: z.string().optional(),
  document3No: z.string().optional(),

  govFee: z.string().optional(),
  quartusFee: z.string().optional(),
  appCenterFee: z.string().optional(),
  shippingQuartusFee: z.string().optional(),
  miscFee: z.string().optional(),

  miscItems: z.array(z.string()).optional(),

  paymentMethod: z.string(),
  paymentStatus: z.string(),
  paidAmount: z.string().optional(),
  employeeId: z.string().optional(),
});

const ReceiptForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      serviceCategory: '',
      miscService: '',

      document1: '',
      document1No: '',
      document2: '',
      document2No: '',
      document3: '',
      document3No: '',

      govFee: '',
      quartusFee: '',
      appCenterFee: '',
      shippingQuartusFee: '',
      miscFee: '',

      miscItems: [],

      paymentMethod: '',
      paymentStatus: '',
      paidAmount: '',
      employeeId: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const miscOptions = ['Convenience Fee', 'Notary Fee', 'Pictures', 'Money Order'];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Receipt Details */}
        <div className="p-4 border rounded-md grid sm:grid-cols-2 gap-4">
          <h2 className="col-span-2 font-semibold">Receipt Details</h2>
          <FormField
            name="firstName"
            control={form.control}
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
            name="lastName"
            control={form.control}
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
            name="email"
            control={form.control}
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
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <PhoneInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="serviceCategory"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="misc">Misc</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="miscService"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miscellaneous Service</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Documents */}
          <FormField
            name="document1"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document 1</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="document1No"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="document2"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document 2</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="document2No"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="document3"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document 3</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="document3No"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Service Fees */}
        <div className="p-4 border rounded-md grid sm:grid-cols-2 gap-4">
          <h2 className="col-span-2 font-semibold">Service Fees</h2>
          <FormField
            name="govFee"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Government Fee</FormLabel>
                <FormControl>
                  <Input type="number" prefix="$" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="quartusFee"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quartus Fee</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Shipping Fees */}
        <div className="p-4 border rounded-md grid sm:grid-cols-2 gap-4">
          <h2 className="col-span-2 font-semibold">Shipping Fees</h2>
          <FormField
            name="appCenterFee"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Center Fee</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="shippingQuartusFee"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quartus Fee</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Miscellaneous */}
        <div className="p-4 border rounded-md space-y-2">
          <h2 className="font-semibold">Miscellaneous</h2>
          <FormField
            name="miscFee"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miscellaneous</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {miscOptions.map((item) => (
              <FormField
                key={item}
                name="miscItems"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value?.includes(item)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value!, item])
                          : field.onChange(field.value!.filter((val) => val !== item));
                      }}
                    />
                    <FormLabel className="text-sm font-normal">{item}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Payment Status */}
        <div className="p-4 border rounded-md grid sm:grid-cols-2 gap-4">
          <h2 className="col-span-2 font-semibold">Payment Status</h2>
          <FormField
            name="paymentMethod"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            name="paymentStatus"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="paid">Fully Paid</SelectItem>
                    <SelectItem value="partial">Partially Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            name="paidAmount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Paid</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="employeeId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default ReceiptForm;
