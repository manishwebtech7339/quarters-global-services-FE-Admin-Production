'use server';
import { fetcher } from '@/lib/fetcher';
import { TaxBureauDataType } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export interface TaxBureauListResponse {
  status: boolean;
  message: string;
  data: {
    data: TaxBureauDataType[];
    count: number;
    currentPage: number;
    totalPages: number;
  };
}

export const getTaxBureau = async ({
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
}): Promise<TaxBureauListResponse> => {
  try {
    const response = await fetcher(
      `/tax-bureau?page=${page}&search=${search}&from=${from}&to=${to}&status=${status}&createdBy=${createdBy}`,
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

export const getTaxBureauById = async (id: string): Promise<TaxBureauDataType | null> => {
  try {
    const data = await fetcher('/tax-bureau/' + id, {
      cache: 'no-cache',
      revalidate: 60,
    });
    return data?.data || null;
  } catch (error) {
    console.log(error, 'Ticket fetch error');
    return null;
  }
};

export const deleteTaxBureau = async (id: string) => {
  try {
    const result = await fetcher(`/tax-bureau/${id}`, {
      method: 'DELETE',
    });
    revalidatePath('/admin/tax-bureau');
    return result;
  } catch (error) {
    throw error;
  }
};
