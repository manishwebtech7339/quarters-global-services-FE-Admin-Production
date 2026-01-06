'use client';
import React, { useState } from 'react';
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
import { FileInput } from '@/components/ui/file-input';
import { uploadFile } from '@/lib/uploadUtils';
import { createTraining, TrainingDataType, updateTraining } from '@/services/trainigsService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import handleAsync from '@/lib/handleAsync';
import Link from 'next/link';
import ComboSelect from '../applicationForm/components/ComboSelect';
import { commonFieldSchema, documentFileSchema } from '@/lib/formSchemaFunctions';

const trainingFormSchema = z.object({
  title: commonFieldSchema(),
  toCountryId: commonFieldSchema(),
  platformServiceId: commonFieldSchema(),
  platformServiceCategoryId: commonFieldSchema(),
  platformServiceSubCategoryId: commonFieldSchema().optional().or(z.literal('')),
  description: commonFieldSchema().optional().or(z.literal('')),
  resource: documentFileSchema({ MAX_FILE_SIZE: 16 * 1024 * 1024 }),
});

const TrainingForm = ({
  isView,
  isEdit,
  defaultData,
}: {
  isView?: boolean;
  isEdit?: boolean;
  defaultData?: TrainingDataType;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof trainingFormSchema>>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      title: defaultData?.title || '',
      description: defaultData?.description || '',
      toCountryId: defaultData?.country?._id || '',
      platformServiceId: defaultData?.service?._id || '',
      platformServiceCategoryId: defaultData?.category?._id || '',
      platformServiceSubCategoryId: defaultData?.subCategory?._id || '',
      resource: defaultData?.resource || '',
    },
  });
  console.log(form.formState.errors, ':Training Form Errors');

  const [isSubCategoriesAvailable, setIsSubCategoriesAvailable] = useState(
    !!defaultData?.subCategory,
  );

  const onSubmit = handleAsync(async (data: z.infer<typeof trainingFormSchema>) => {
    if (isView) return;

    // Step 1: Upload files if they are new File objects
    let resourceUrl = data?.resource || '';

    console.log(data.resource, 'data.resource');
    if (data.resource instanceof File) {
      console.log('Uploading resource ...');
      const uploadedUrl = await uploadFile(data.resource, 'resource-scan');
      if (!uploadedUrl) {
        throw new Error('Failed to upload resource');
      }
      resourceUrl = uploadedUrl;
    }

    if (!resourceUrl) {
      form.setError('resource', { message: 'Resource is required' });
      return;
    }

    // Step 2: Prepare the payload with uploaded URLs
    const payload = {
      title: data.title,
      description: data.description,
      country: data.toCountryId,
      service: data.platformServiceId,
      category: data.platformServiceCategoryId,
      subCategory: data.platformServiceSubCategoryId || undefined,
      resource: resourceUrl,
    };

    if (isEdit && defaultData?._id) {
      // Update existing training
      await updateTraining({ ...payload, id: defaultData._id });
      toast.success('Training Updated Successfully');
    } else {
      // Create new training
      await createTraining(payload);
      toast.success('Training Created Successfully');
    }

    // Redirect to trainings list
    router.push('/admin/training');
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-4 grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ComboSelect
            name="toCountryId"
            placeholder="Select Country"
            apiPath="/country/get-country?page=1&pageSize=256"
            enable={isView ? false : true}
          />

          <ComboSelect
            name="platformServiceId"
            placeholder="Select Service"
            enable={isView ? false : form.watch('toCountryId') ? true : false}
            apiPath={
              form.watch('toCountryId')
                ? `/platform-service/get-platform-service?toCountryId=${form.watch('toCountryId')}`
                : ''
            }
          />

          <ComboSelect
            name="platformServiceCategoryId"
            placeholder="Select Category"
            enable={isView ? false : form.watch('platformServiceId') ? true : false}
            apiPath={
              form.watch('platformServiceId')
                ? `/platform-service-category/get-platform-service-category?platformServiceId=${form.watch('platformServiceId')}&toCountryId=${form.watch('toCountryId')}`
                : ''
            }
            onSelectIsHaveSubCategory={setIsSubCategoriesAvailable}
            onSelect={() => {
              form.setValue('platformServiceSubCategoryId', '');
            }}
          />

          {isSubCategoriesAvailable && (
            <ComboSelect
              name="platformServiceSubCategoryId"
              placeholder="Select Sub Category"
              enable={isView ? false : form.watch('platformServiceCategoryId') ? true : false}
              apiPath={
                form.watch('platformServiceCategoryId')
                  ? `/platform-service-category/get-platform-service-category?platformServiceCategoryId=${form.watch('platformServiceCategoryId')}&platformServiceId=${form.watch('platformServiceId')}&toCountryId=${form.watch('toCountryId')}`
                  : ''
              }
            />
          )}

          <FormField
            control={form.control}
            name="resource"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Upload Resource</FormLabel>
                <FormControl>
                  <FileInput
                    onFileChange={field.onChange}
                    existingFileUrl={defaultData?.resource}
                    existingFileName={defaultData?.resource}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!isView && (
          <div className="flex items-center gap-2 justify-end">
            <Button asChild type="button" variant="outline" disabled={form.formState.isSubmitting}>
              <Link href="/admin/training">Cancel</Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                  ? 'Update Training'
                  : 'Create Training'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default TrainingForm;
