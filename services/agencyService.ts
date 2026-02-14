'use server';
import { fetcher } from '@/lib/fetcher';
import { ApiPagination, AgencyDataType, UserTypeENUM, UserDataType } from '@/lib/types';
import { commonEmptyResponse } from './helper';
import { AgencyFormType } from '@/components/forms/agencyForm/AgencyForm';
import { revalidatePath } from 'next/cache';

export const getAgents = async ({
  role = UserTypeENUM.AGENT,
  page = '1',
  search = '',
}: {
  role?: UserTypeENUM;
  page?: string;
  search?: string;
}): Promise<ApiPagination & { data: UserDataType[] }> => {
  try {
    const data = await fetcher(`/user/get-all-user?roles=${role}&page=${page}&search=${search}`, {
      cache: 'no-cache',
      revalidate: 60,
    });

    return data?.data || [];
  } catch (error) {
    console.log(error, 'User fetch error');
    return commonEmptyResponse;
  }
};

export const getAgencies = async ({
  page,
  status,
  search,
  from,
  to,
}: {
  page: string;
  status?: string;
  search?: string;
  from?: string;
  to?: string;
}): Promise<ApiPagination & { data: AgencyDataType[] }> => {
  try {
    const response = await fetcher(
      `/agency/get-agencies?page=${page}&search=${search}&status=${status}&from=${from}&to=${to}`,
      {
        cache: 'no-cache',
        revalidate: 60,
      },
    );

    // Transform the API response to match our expected structure
    if (response?.data) {
      return {
        data: response.data.data || [],
        count: response.data.total || 0,
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
      };
    }

    return commonEmptyResponse;
  } catch (error) {
    console.log(error, 'Agencies fetch error');
    return commonEmptyResponse;
  }
};

export const getAgencyById = async (id: string): Promise<AgencyDataType | null> => {
  try {
    const data = await fetcher('/agency/get-agency/' + id, {
      cache: 'no-cache',
      revalidate: 60,
    });
    return data?.data || null;
  } catch (error) {
    console.log(error, 'Agency fetch error');
    return null;
  }
};

export const deleteAgency = async (id: string): Promise<boolean> => {
  try {
    const response = await fetcher(`/agency/delete-agency/${id}`, {
      method: 'DELETE',
    });
    revalidatePath('/admin/agencies');
    return response?.status || false;
  } catch (error) {
    console.log(error, 'Agency delete error');
    return false;
  }
};

export const createAgency = async (
  agencyData: Partial<AgencyFormType>,
): Promise<(Omit<AgencyDataType, 'managers'> & { managers: string[] }) | null> => {
  try {
    const response = await fetcher('/agency/create-agency', {
      method: 'POST',
      body: agencyData,
    });
    revalidatePath('/admin/agencies');
    return response?.data || null;
  } catch (error) {
    console.log(error, 'Agency create error');
    throw error;
  }
};

export const updateAgency = async (
  agencyData: Partial<AgencyFormType>,
): Promise<AgencyDataType | null> => {
  try {
    const response = await fetcher(`/agency/update-agency`, {
      method: 'PUT',
      body: agencyData,
    });
    revalidatePath('/admin/agencies');
    return response?.data || null;
  } catch (error) {
    console.log(error, 'Agency update error');
    throw error;
  }
};

export const updateCreditLimitAgency = async (id: string, creditLimit: number): Promise<any> => {
  try {
    const response = await fetcher(`/agency/update-credit-limit`, {
      method: 'PUT',
      body: { id, creditLimit },
    });

    return response?.data || null;
  } catch (error) {
    console.log(error, 'Agency credit update error');
    throw error;
  }
};

export const updateApprovalStatusAgency = async (
  id: string,
  isApproved: boolean,
  approvalNotes: string,
): Promise<any> => {
  try {
    const response = await fetcher(`/agency/update-agency-approval-status`, {
      method: 'PUT',
      body: { id, isApproved, approvalNotes },
    });

    return response?.data || null;
  } catch (error) {
    console.log(error, 'Agency credit update error');
    throw error;
  }
};

export const getAgenciesAddCreditsTransitions = async ({
  agencyId,
  page,
  from,
  to,
}: {
  agencyId?: string;
  page: string;
  from?: string;
  to?: string;
}): Promise<ApiPagination & { data: AgencyDataType[] }> => {
  try {
    const response = await fetcher(
      `/agency/credits-add-transitions?agencyId=${agencyId}&page=${page}&from=${from}&to=${to}`,
      {
        cache: 'no-cache',
        revalidate: 60,
      },
    );

    // Transform the API response to match our expected structure
    if (response?.data) {
      return {
        data: response.data.data || [],
        count: response.data.total || 0,
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
      };
    }

    return commonEmptyResponse;
  } catch (error) {
    console.log(error, 'Agencies fetch error');
    return commonEmptyResponse;
  }
};

export const getAgenciesUsedCreditsTransitions = async ({
  agencyId,
  page,
  from,
  to,
  search,
}: {
  agencyId?: string;
  page: string;
  from?: string;
  to?: string;
  search?: string;
}): Promise<ApiPagination & { data: AgencyDataType[] }> => {
  try {
    const response = await fetcher(
      `/agency/credits-used-transitions?agencyId=${agencyId}&page=${page}&from=${from}&to=${to}&search=${search}`,
      {
        cache: 'no-cache',
        revalidate: 60,
      },
    );

    // Transform the API response to match our expected structure
    if (response?.data) {
      return {
        data: response.data.data || [],
        count: response.data.total || 0,
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
      };
    }

    return commonEmptyResponse;
  } catch (error) {
    console.log(error, 'Agencies fetch error');
    return commonEmptyResponse;
  }
};
