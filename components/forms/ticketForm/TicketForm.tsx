'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileInput } from '@/components/ui/file-input';
import { useRouter } from 'next/navigation';
import { CustomerDataType } from '@/services/customerService';
import { UserDataType, UserTypeENUM } from '@/lib/types';
import { uploadFile } from '@/lib/uploadUtils';
import { fetcher } from '@/lib/fetcher';
import { commonFieldSchema, documentFileSchema } from '@/lib/formSchemaFunctions';
import { TicketDataType } from '@/services/ticketsService';
import { FormCombobox } from '@/components/common/FormComboBox';
import Link from 'next/link';
import { Label } from '@/components/ui/label';

const ticketStatusOptions = ['Open', 'Waiting on Customer', 'Resolved', 'Closed'] as const;
const ticketPriorityOptions = ['Normal', 'High', 'Urgent'] as const;

const ticketFormSchema = z.object({
  status: z.enum(ticketStatusOptions),
  priority: z.enum(ticketPriorityOptions),
  customer: commonFieldSchema(),
  applicationId: commonFieldSchema(),
  category: commonFieldSchema(),
  // subCategory: commonFieldSchema().optional(),
  assignedStaff: commonFieldSchema(),
  subject: commonFieldSchema().optional().or(z.literal('')),
  description: commonFieldSchema().optional().or(z.literal('')),
  passportScan: documentFileSchema({}),
  serviceForm: documentFileSchema({}),
  signature: documentFileSchema({}),
});

interface TicketFormProps {
  isView?: boolean;
  isEdit?: boolean;
  customers?: CustomerDataType[];
  staff?: UserDataType[];
  applications?: any[];
  ticketData?: TicketDataType;
}

const TicketForm = ({
  isView = false,
  isEdit = false,
  ticketData,
  customers = [],
  staff = [],
  applications = [],
}: TicketFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showApplicationDetails, setShowApplicationDetails] = useState({
    service: '',
    category: '',
    subCategory: '',
    package: '',
  });

  const form = useForm<z.infer<typeof ticketFormSchema>>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      status: (ticketData?.status || 'Open') as z.infer<typeof ticketFormSchema>['status'],
      priority: (ticketData?.priority || 'Normal') as z.infer<typeof ticketFormSchema>['priority'],
      customer: ticketData?.customer?._id || '',
      applicationId: ticketData?.applicationId || '',
      category: ticketData?.category || '',
      assignedStaff: ticketData?.assignedStaff || '',
      subject: ticketData?.subject || '',
      description: ticketData?.description || '',
      passportScan: ticketData?.passportScan || null,
      serviceForm: ticketData?.serviceForm || null,
      signature: ticketData?.signature || null,
    },
  });

  console.log(ticketData, 'ticketData');

  const onSubmit = async (data: z.infer<typeof ticketFormSchema>) => {
    if (isView) return;

    try {
      setIsLoading(true);

      // Step 1: Upload files if they are new File objects
      let passportScanUrl = ticketData?.passportScan?.file || '';
      let passportScanFileName = ticketData?.passportScan?.filename || '';
      let passportScanFileType = ticketData?.passportScan?.mimeType || '';

      let serviceFormUrl = ticketData?.serviceForm?.file || '';
      let serviceFormUrlName = ticketData?.serviceForm?.filename || '';
      let serviceFormUrlType = ticketData?.serviceForm?.mimeType || '';

      let signatureUrl = ticketData?.signature?.file || '';
      let signatureUrlName = ticketData?.signature?.filename || '';
      let signatureUrlType = ticketData?.signature?.mimeType || '';

      if (data.passportScan instanceof File) {
        const uploadedUrl = await uploadFile(data.passportScan, 'ticket-passport-scan');
        if (!uploadedUrl) {
          throw new Error('Failed to upload passport scan');
        }
        passportScanUrl = uploadedUrl;
        passportScanFileName = data.passportScan.name;
        passportScanFileType = data.passportScan.type;
      }

      if (data.serviceForm instanceof File) {
        const uploadedUrl = await uploadFile(data.serviceForm, 'ticket-service-form');
        if (!uploadedUrl) {
          throw new Error('Failed to upload service form');
        }
        serviceFormUrl = uploadedUrl;
        serviceFormUrlName = data.serviceForm.name;
        serviceFormUrlType = data.serviceForm.type;
      }

      if (data.signature instanceof File) {
        console.log('Uploading signature...');
        const uploadedUrl = await uploadFile(data.signature, 'ticket-signature');
        if (!uploadedUrl) {
          throw new Error('Failed to upload signature');
        }
        signatureUrl = uploadedUrl;
        signatureUrlName = data.signature.name;
        signatureUrlType = data.signature.type;
      }

      // Step 2: Prepare the payload with uploaded URLs
      const payload = {
        customer: data.customer,
        applicationId: data.applicationId || '',
        category: data.category,
        assignedStaff: data.assignedStaff || '',
        subject: data.subject,
        description: data.description || '',
        priority: data.priority,
        status: data.status,
        passportScan: passportScanUrl
          ? {
              file: passportScanUrl,
              fileName: passportScanFileName,
              mimeType: passportScanFileType,
            }
          : null,
        serviceForm: serviceFormUrl
          ? {
              file: serviceFormUrl,
              fileName: serviceFormUrlName,
              mimeType: serviceFormUrlType,
            }
          : null,
        signature: signatureUrl
          ? {
              file: signatureUrl,
              fileName: signatureUrlName,
              mimeType: signatureUrlType,
            }
          : null,
      };

      if (isEdit && ticketData?._id) {
        // Update existing ticket
        await fetcher(`/ticket/update-ticket`, {
          method: 'PUT',
          body: { ...payload, id: ticketData._id },
        });
        toast.success('Ticket Updated Successfully');
      } else {
        // Create new ticket
        await fetcher('/ticket/create-ticket', {
          method: 'POST',
          body: payload,
        });
        // await createTicket(payload);
        toast.success('Ticket Created Successfully');
      }

      // Redirect to tickets list
      router.push('/admin/tickets');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
      console.error(`Error ${isEdit ? 'updating' : 'creating'} ticket:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4 p-4 border rounded-lg">
          <div className="col-span-2 border-b pb-2 flex items-center justify-between">
            <p className="font-semibold">
              {isEdit && ticketData?._id
                ? `Ticket ID : #${ticketData._id.slice(-8)}`
                : 'Create New Ticket'}
            </p>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-fit">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketPriorityOptions.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <FormCombobox
            control={form.control}
            name="customer"
            label="Select Customer"
            apiUrl="/user/get-all-user?roles=user"
            initialOptions={customers}
            formatLabel={(item) => `${item.firstName} ${item.lastName} (${item.email})`}
          />

          <FormCombobox
            disabled={!form.watch('customer')}
            control={form.control}
            name="applicationId"
            label="Select Application"
            apiUrl={`/application/get-application?userId=${form.watch('customer')}`}
            initialOptions={applications}
            formatLabel={(item) =>
              `${item.serviceFields?.service} - ${item.serviceFields?.serviceType}`
            }
            onSelect={(e) => {
              console.log(e, 'teasdfasdfasd');
              // if(e?.serviceFields?.service) form.setValue("category",e?.serviceFields?.service)
              // if(e?.serviceFields?.service) form.setValue("subCategory",e?.serviceFields?.serviceType)
            }}
          />

          {showApplicationDetails.service && (
            <div>
              <Label className="mb-2">Service</Label>
              <Input value={showApplicationDetails.service} readOnly />
            </div>
          )}
          {showApplicationDetails.category && (
            <div>
              <Label className="mb-2">Category</Label>
              <Input value={showApplicationDetails.category} readOnly />
            </div>
          )}
          {showApplicationDetails.subCategory && (
            <div>
              <Label className="mb-2">Sub Category</Label>
              <Input value={showApplicationDetails.subCategory} readOnly />
            </div>
          )}
          {showApplicationDetails.package && (
            <div>
              <Label className="mb-2">Package</Label>
              <Input value={showApplicationDetails.package} readOnly />
            </div>
          )}

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Category</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Application Process">Application Process</SelectItem>
                      <SelectItem value="Status Inquiry">Status Inquiry</SelectItem>
                      <SelectItem value="Complaint">Complaint</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormCombobox
            control={form.control}
            name="assignedStaff"
            label="Select Staff"
            apiUrl={`/user/get-all-user?roles=${UserTypeENUM.SUBADMIN}`}
            initialOptions={staff}
            formatLabel={(item) => `${item.firstName ?? ''} ${item.lastName ?? ''} (${item.email})`}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Attachments */}
        <div className="p-4 border rounded-lg space-y-4">
          <p className="font-semibold col-span-2 border-b pb-2">Attachments</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField<z.infer<typeof ticketFormSchema>>
              control={form.control}
              name="passportScan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport Scan</FormLabel>
                  <FormControl>
                    <FileInput
                      onFileChange={field.onChange}
                      existingFileUrl={ticketData?.passportScan?.file}
                      existingFileName={ticketData?.passportScan?.filename || 'passport-scan.pdf'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<z.infer<typeof ticketFormSchema>>
              control={form.control}
              name="serviceForm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Form</FormLabel>
                  <FormControl>
                    <FileInput
                      onFileChange={field.onChange}
                      existingFileUrl={ticketData?.serviceForm?.file}
                      existingFileName={ticketData?.serviceForm?.filename || 'service-form.pdf'}
                    />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<z.infer<typeof ticketFormSchema>>
              control={form.control}
              name="signature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature</FormLabel>
                  <FormControl>
                    <FileInput
                      onFileChange={field.onChange}
                      existingFileUrl={ticketData?.signature?.file}
                      existingFileName={ticketData?.signature?.filename || 'signature.png'}
                    />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Buttons */}
        {!isView && (
          <div className="flex justify-end gap-2">
            <Button asChild type="button" variant="outline" disabled={isLoading}>
              <Link href="/admin/tickets">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                  ? 'Update Ticket'
                  : 'Create Ticket'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default TicketForm;
