'use client';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
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
import { UserDataType } from '@/lib/types';
import handleAsync from '@/lib/handleAsync';
import { commonFieldSchema, passwordSchema } from '@/lib/formSchemaFunctions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { editProfile } from '@/services/profileService';
import { PhoneInput2 } from '@/components/ui/PhoneInput2';
import { FileInput } from '@/components/ui/file-input';
import { uploadFile } from '@/lib/uploadUtils';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  firstName: commonFieldSchema(),
  lastName: commonFieldSchema(),
  countryCode: commonFieldSchema(),
  phone: commonFieldSchema(),
  password: passwordSchema().optional().or(z.literal('')),
  profilePicture: z.any().optional().or(z.literal('')),
});

export type ProfileFormSchemaType = z.infer<typeof formSchema>;

const ProfileForm = ({
  isView = false,
  userData,
}: {
  isView?: boolean;
  userData?: UserDataType;
}) => {
  const router = useRouter();
  const form = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      phone: userData?.phone || '',
      countryCode: userData?.countryCode || '',
      profilePicture: userData?.profilePicture || '',
      password: undefined,
    },
  });
  const watchValues = useWatch({ control: form.control });

  const onSubmit = handleAsync(async (values: ProfileFormSchemaType) => {
    if (isView) return;

    if (!userData) {
      toast.error('User not found');
      return;
    }

    let profilePicture: string = values.profilePicture;

    if (values.profilePicture instanceof File) {
      const uploadedUrl = await uploadFile(values.profilePicture, `profile-image`);
      if (!uploadedUrl) {
        throw new Error(`Failed to upload profile image`);
      }
      profilePicture = uploadedUrl;
    }

    const prepareData = {
      ...values,
      profilePicture,
    };

    await editProfile(userData._id, prepareData);
    toast.success('User updated successfully');

    form.reset({});

    window.location.href = '/admin/profile';
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          {isView && <div className=" font-semibold col-span-2 border-b pb-2">User Details</div>}

          <FormField
            name="profilePicture"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <FileInput
                    ref={field.ref}
                    disabled={isView}
                    onFileChange={field.onChange}
                    selectedFileValue={field.value instanceof File ? field.value : null}
                    existingFileUrl={watchValues?.profilePicture || ''}
                    existingFileName={watchValues?.profilePicture || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input readOnly={isView} placeholder="" {...field} />
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
                  <Input readOnly={isView} placeholder="" {...field} />
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

          {!isView && (
            <div className="col-span-2 space-y-4">
              <Separator />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Password (Optional)</FormLabel>
                    <FormDescription>
                      Enter your new password. Leave this field blank if you do not want to update
                      it.
                    </FormDescription>
                    <FormControl>
                      <Input readOnly={isView} placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Link href="/admin/profile">
            <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>
              {isView ? 'Back' : 'Cancel'}
            </Button>
          </Link>
          {!isView && (
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
