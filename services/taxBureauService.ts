'use server';
import { fetcher } from '@/lib/fetcher';
import { TaxBureauDataType } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export interface TicketDataType {
  _id: string;
  status: 'Open' | 'Closed' | 'Resolved' | 'Waiting on Customer' | 'Urgent';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  customer: string;
  applicationId: string;
  category: string;
  subCategory?: string;
  assignedStaff?: string;
  subject: string;
  description?: string;
  // attachments: TicketAttachments;
  passportScan?: {
    file: string;
    filename: string;
    mimeType: string;
  };
  serviceForm?: {
    file: string;
    filename: string;
    mimeType: string;
  };
  signature?: {
    file: string;
    filename: string;
    mimeType: string;
  };

  isDeleted: boolean;
  deletedBy?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const getTaxBureau = async (): Promise<TaxBureauDataType[]> => {
  try {
    const response = await fetcher(`/tax-bureau`, {
      cache: 'no-cache',
      revalidate: 60,
    });

    return response?.data || [];
  } catch (error) {
    console.log(error, 'Tax fetch error');
    return [];
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
