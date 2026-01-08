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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetcher } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/uploadUtils';
import { UserTypeENUM } from '@/lib/types';
import { commonFieldSchema, documentFileSchema } from '@/lib/formSchemaFunctions';

const formSchema = z.object({
  vehicleName: commonFieldSchema(),
  vehicleType: commonFieldSchema(),
  licensePlateNumber: commonFieldSchema(),
  seatingCapacity: commonFieldSchema(),
  ACorNONAC: z.enum(['AC', 'NON-AC']),
  color: commonFieldSchema(),
  fuelType: commonFieldSchema(),
  transmissionType: commonFieldSchema(),
  insuranceExpiryDate: commonFieldSchema(),
  status: commonFieldSchema(),
  image: documentFileSchema({}),
  documentOne: documentFileSchema({}),
  documentTwo: documentFileSchema({}),
});

interface VehicleFormProps {
  isView?: boolean;
  isEdit?: boolean;
  vehicleData?: any; // We'll use any for now since the API structure might differ from VehicleDataType
  role?: UserTypeENUM;
}

const VehicleAddForm = ({ isView, isEdit, vehicleData, role }: VehicleFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleName: vehicleData?.vehicleName || '',
      vehicleType: vehicleData?.vehicleType || 'Car',
      licensePlateNumber: vehicleData?.licensePlateNumber || '',
      seatingCapacity: vehicleData?.seatingCapacity || '',
      ACorNONAC: vehicleData?.ACorNONAC || 'AC',
      color: vehicleData?.color || '',
      fuelType: vehicleData?.fuelType || 'Petrol',
      transmissionType: vehicleData?.transmissionType || 'Manual',
      insuranceExpiryDate: vehicleData?.insuranceExpiryDate
        ? vehicleData.insuranceExpiryDate.split('T')[0]
        : '',
      status: vehicleData?.status,
      image: vehicleData?.image || undefined,
      documentOne: vehicleData?.documentOne || undefined,
      documentTwo: vehicleData?.documentTwo || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form Values:', values);
    try {
      setIsLoading(true);

      let imageData = vehicleData?.image || undefined;
      let documentOneData = vehicleData?.documentOne || undefined;
      let documentTwoData = vehicleData?.documentTwo || undefined;

      // Step 1: Upload files if they are new File objects and create document objects
      if (values.image instanceof File) {
        const uploadedUrl = await uploadFile(values.image, 'vehicle-image');
        if (!uploadedUrl) {
          throw new Error('Failed to upload document one');
        }
        imageData = {
          file: uploadedUrl,
          fileName: values.image.name,
          mimeType: values.image.type,
        };
      }

      if (values.documentOne instanceof File) {
        const uploadedUrl = await uploadFile(values.documentOne, 'vehicle-document-1');
        if (!uploadedUrl) {
          throw new Error('Failed to upload document one');
        }
        documentOneData = {
          file: uploadedUrl,
          fileName: values.documentOne.name,
          mimeType: values.documentOne.type,
        };
      }

      if (values.documentTwo instanceof File) {
        const uploadedUrl = await uploadFile(values.documentTwo, 'vehicle-document-2');
        if (!uploadedUrl) {
          throw new Error('Failed to upload document two');
        }
        documentTwoData = {
          file: uploadedUrl,
          fileName: values.documentTwo.name,
          mimeType: values.documentTwo.type,
        };
      }

      // Step 2: Prepare the payload with document objects
      const payload = {
        vehicleName: values.vehicleName,
        vehicleType: values.vehicleType,
        licensePlateNumber: values.licensePlateNumber,
        seatingCapacity: values.seatingCapacity,
        ACorNONAC: values.ACorNONAC,
        color: values.color,
        fuelType: values.fuelType,
        transmissionType: values.transmissionType,
        insuranceExpiryDate: values.insuranceExpiryDate,
        status: values.status,
        image: imageData,
        documentOne: documentOneData,
        documentTwo: documentTwoData,
      };

      let response;
      if (isEdit && vehicleData?._id) {
        // Update existing vehicle
        response = await fetcher(`/vehicle/update/${vehicleData._id}`, {
          method: 'PUT',
          body: payload,
        });
        toast.success('Vehicle Updated Successfully');
      } else {
        // Create new vehicle
        response = await fetcher('/vehicle/create', {
          method: 'POST',
          body: payload,
        });
        toast.success('Vehicle Created Successfully');
      }
      console.log(response);
      // Redirect to vehicles list or show success message
      if (role === UserTypeENUM.AGENT) {
        router.push('/agent/vehicles/vehicles-management');
      } else {
        router.push('/admin/vehicles/vehicles-management');
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(`Error ${isEdit ? 'updating' : 'creating'} vehicle:`, error);
      // You can add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          {isView && <p className=" font-semibold col-span-2 border-b pb-2">Vehicle Details</p>}

          <FormField
            control={form.control}
            name="vehicleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Name</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isView}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Coupe">Coupe</SelectItem>
                    <SelectItem value="Convertible">Convertible</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="licensePlateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Plate Number</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seatingCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seating Capacity</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ACorNONAC"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AC/Non-AC</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isView}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="NON-AC">Non-AC</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isView}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transmissionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmission Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isView}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select transmission type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="insuranceExpiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="" disabled={isView} {...field} />
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
                    <SelectItem value="active">Available</SelectItem>
                    <SelectItem value="inactive">Not-available</SelectItem>
                  </SelectContent>
                </Select>
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
          )}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Vehicle Image</FormLabel>
                <FormControl>
                  <FileInput
                    onFileChange={field.onChange}
                    existingFileUrl={vehicleData?.image?.file}
                    existingFileName={vehicleData?.image?.fileName}
                    disabled={isView}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="documentOne"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document 1</FormLabel>
                <FormControl>
                  <FileInput
                    onFileChange={field.onChange}
                    existingFileUrl={vehicleData?.documentOne?.file}
                    existingFileName={vehicleData?.documentOne?.fileName}
                    disabled={isView}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="documentTwo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document 2</FormLabel>
                <FormControl>
                  <FileInput
                    onFileChange={field.onChange}
                    existingFileUrl={vehicleData?.documentTwo?.file}
                    existingFileName={vehicleData?.documentTwo?.fileName}
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

export default VehicleAddForm;
