'use server';
import {
  CustomerEditFormSchemaType,
  CustomerFormSchemaType,
} from '@/components/forms/customerForm/CustomerForm';
import { fetcher } from '@/lib/fetcher';
import { UserTypeENUM } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export interface CustomerDataType {
  _id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  alternatePhone: string;
  dob: string;
  gender: string;
  address: Address;
  otp: string;
  otpExpiryTime: string;
  profilePicture: any;
  isVerified: boolean;
  status: string;
  isDeleted: boolean;
  deletedBy: any;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Address {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  _id: string;
}

export interface CustomerListResponse {
  status: boolean;
  message: string;
  data: {
    data: CustomerDataType[];
    count: number;
    currentPage: number;
    totalPages: number;
  };
}

export const getAllCustomers = async ({
  page = '1',
  search = '',
  from = '',
  to = '',
  status = '',
  createdBy = '',
}: {
  page: string;
  search?: string;
  from?: string;
  to?: string;
  status?: string;
  createdBy?: string;
}): Promise<CustomerListResponse> => {
  try {
    const response = await fetcher(
      `/user/get-all-user?page=${page}&roles=${UserTypeENUM.USER}&search=${search}&from=${from}&to=${to}&status=${status}&createdBy=${createdBy}`,
      {
        method: 'GET',
      },
    );
    return response;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getCustomerById = async (id: string): Promise<CustomerDataType> => {
  try {
    const response = await fetcher(`/user/get-user/${id}`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

export const createCustomer = async (body: CustomerFormSchemaType) => {
  try {
    const prePareData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      countryCode: body.countryCode || '+1',
      phone: body.phone,
      alternatePhone: body.alternatePhone || '',
      dob: body.dateOfBirth || '',
      gender: body.gender || 'other',
      status: body.status || undefined,
      role: UserTypeENUM.USER,
      address: {
        addressLine1: body.address || '',
        addressLine2: '',
        city: body.city || '',
        state: body.state || '',
        zipCode: body.pincode || '',
        country: body.country || '',
      },
    };
    const result = await fetcher('/user/create-user', {
      method: 'POST',
      body: prePareData,
    });
    revalidatePath('/admin/customers');
    revalidatePath('/agent/customers');
    return result;
  } catch (error) {
    throw error;
  }
};

export const editCustomer = async (id: string, body: CustomerEditFormSchemaType) => {
  try {
    const prePareData = {
      firstName: body.firstName || undefined,
      lastName: body.lastName || undefined,
      // email: body.email,
      password: body.password || undefined,
      countryCode: body.countryCode || undefined,
      phone: body.phone,
      alternatePhone: body.alternatePhone || undefined,
      dob: body.dateOfBirth || undefined,
      gender: body.gender || 'other',
      status: body.status || undefined,
      address: {
        addressLine1: body.address || undefined,
        addressLine2: '',
        city: body.city || undefined,
        state: body.state || undefined,
        zipCode: body.pincode || undefined,
        country: body.country || undefined,
      },
    };
    const result = await fetcher(`/user/update-user/${id}`, {
      method: 'PUT',
      body: prePareData,
    });
    revalidatePath('/admin/customers');
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    const response = await fetcher(`/user/delete-user/${id}`, {
      method: 'DELETE',
    });
    revalidatePath('/admin/customers');
    return response;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};
