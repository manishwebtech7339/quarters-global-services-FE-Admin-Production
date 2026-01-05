'use server';
import { UserFormSchemaType } from '@/components/forms/userForm/UserForm';
import { fetcher } from '@/lib/fetcher';
import { UserDataType, ApiPagination, UserTypeENUM } from '@/lib/types';
import { commonEmptyResponse } from './helper';
import { revalidatePath } from 'next/cache';

export const getUsers = async ({
  role = UserTypeENUM.SUBADMIN,
  page = '1',
  search = '',
  createdBy,
  from = '',
  to = '',
}: {
  role?: UserTypeENUM;
  page?: string;
  search?: string;
  createdBy?: string;
  from?: string;
  to?: string;
}): Promise<ApiPagination & { data: UserDataType[] }> => {
  try {
    const data = await fetcher(
      `/user/get-all-user?roles=${role}&page=${page}&search=${search}&createdBy=${createdBy}&from=${from}&to=${to}`,
      {
        cache: 'no-cache',
        revalidate: 60,
      },
    );

    return data?.data || [];
  } catch (error) {
    console.log(error, 'User fetch error');
    return commonEmptyResponse;
  }
};

export const getUserById = async (id: string): Promise<UserDataType | null> => {
  try {
    const data = await fetcher('/user/get-user/' + id, {
      cache: 'no-cache',
    });
    return data?.data || null;
  } catch (error) {
    console.log(error, 'User fetch error');
    return null;
  }
};

export const createUser = async (body: UserFormSchemaType) => {
  try {
    const result = await fetcher('/user/create-user', {
      method: 'POST',
      body,
    });
    revalidatePath('/admin/users-and-roles');
    return result;
  } catch (error) {
    throw error;
  }
};

export const editUser = async (id: string, body: UserFormSchemaType) => {
  try {
    const result = await fetcher(`/user/update-user/${id}`, {
      method: 'PUT',
      body,
    });
    revalidatePath('/admin/users-and-roles');
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const result = await fetcher(`/user/delete-user/${id}`, {
      method: 'DELETE',
    });
    revalidatePath('/admin/users-and-roles');
    return result;
  } catch (error) {
    throw error;
  }
};

export const resendOtpToUser = async (body: { userId: string }) => {
  try {
    const result = await fetcher('/auth/resend-otp', {
      method: 'POST',
      body,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async (body: { userId: string; code: string }) => {
  try {
    const result = await fetcher('/auth/verify-user', {
      method: 'POST',
      body,
    });
    revalidatePath('/admin/users-and-roles');
    revalidatePath('/admin/customers');
    return result;
  } catch (error) {
    throw error;
  }
};
