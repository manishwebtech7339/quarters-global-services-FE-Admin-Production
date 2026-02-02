'use client';
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createRole, editRole } from '@/services/rolesService';
import { RoleDataType } from '@/lib/types';
import handleAsync from '@/lib/handleAsync';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  name: z.string().min(1, 'Role is required'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
});

export type RoleFormType = z.infer<typeof formSchema>;

const RoleForm = ({ defaultValues }: { defaultValues?: RoleDataType }) => {
  const router = useRouter();

  const form = useForm<RoleFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      permissions: defaultValues?.permissions || [],
    },
  });

  const onSubmit = handleAsync(async (values: RoleFormType) => {
    if (defaultValues) {
      await editRole({ id: defaultValues._id, ...values });
      toast.success('Role updated successfully');
    } else {
      await createRole(values);
      toast.success('Role created successfully');
    }
    router.push('/admin/users-and-roles?activeTab=roles');
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-4 border rounded-lg grid gap-4">
          {/* Role Select */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Input {...field} placeholder="Enter role type" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Permissions */}
          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-3 border p-3 rounded-md">
              {Object.values(PERMISSIONS_LIST_ENUM).map((permission) => {
                // @Temporary remove these permission // Need to talk with team
                if (
                  [PERMISSIONS_LIST_ENUM.documents, PERMISSIONS_LIST_ENUM.receipts].includes(
                    permission,
                  )
                )
                  return;
                return (
                  <FormField
                    key={permission}
                    control={form.control}
                    name="permissions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(permission)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), permission])
                                : field.onChange(field.value?.filter((v) => v !== permission));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm">
                          {permission
                            .replace(/_/g, ' ')
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={form.formState.isSubmitting}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RoleForm;
