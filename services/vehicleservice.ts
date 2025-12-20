import { fetcher } from '@/lib/fetcher';
import { ApiPagination, BookingDataType, DriverDataType, VehicleDataType } from '@/lib/types';
import { commonEmptyResponse } from './helper';

export const getVehicleBookings = async ({
  page,
  search,
  from,
  to,
}: {
  page: string;
  search?: string;
  from?: string;
  to?: string;
}): Promise<ApiPagination & { data: BookingDataType[] }> => {
  try {
    const response = await fetcher(
      `/vehicle/booking/list?page=${page}&limit=20&search=${search || ''}&from=${from || ''}&to=${to || ''}`,
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
    console.log(error, 'Tickets fetch error');
    return commonEmptyResponse;
  }
};
export const getDriverList = async ({
  page,
  search,
}: {
  page: string;
  search?: string;
}): Promise<ApiPagination & { data: DriverDataType[] }> => {
  try {
    const response = await fetcher(
      `/vehicle/driver/list?page=${page}&limit=20&search=${search || ''}`,
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
    console.log(error, 'Tickets fetch error');
    return commonEmptyResponse;
  }
};
export const getVehicleList = async ({
  page,
  search,
}: {
  page: string;
  search?: string;
}): Promise<ApiPagination & { data: VehicleDataType[] }> => {
  try {
    const response = await fetcher(`/vehicle/list?page=${page}&limit=20&search=${search || ''}`, {
      cache: 'no-cache',
      revalidate: 60,
    });

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
    console.log(error, 'Tickets fetch error');
    return commonEmptyResponse;
  }
};

export const getVehicleById = async (id: string): Promise<VehicleDataType | null> => {
  try {
    const data = await fetcher('/vehicle/' + id, {
      cache: 'no-cache',
      revalidate: 60,
    });
    return data?.data || null;
  } catch (error) {
    console.log(error, 'Vehicle fetch error');
    return null;
  }
};

export const getDriverById = async (id: string): Promise<DriverDataType | null> => {
  try {
    const data = await fetcher('/vehicle/driver/' + id, {
      cache: 'no-cache',
      revalidate: 60,
    });
    return data?.data || null;
  } catch (error) {
    console.log(error, 'Driver fetch error');
    return null;
  }
};

export const getBookingById = async (id: string): Promise<BookingDataType | null> => {
  try {
    const data = await fetcher('/vehicle/booking/' + id, {
      cache: 'no-cache',
      revalidate: 60,
    });
    return data?.data || null;
  } catch (error) {
    console.log(error, 'Booking fetch error');
    return null;
  }
};

// Delete functions
export const deleteVehicle = async (id: string): Promise<boolean> => {
  try {
    const response = await fetcher(`/vehicle/${id}`, {
      method: 'DELETE',
    });
    return response?.status || false;
  } catch (error) {
    console.log(error, 'Vehicle delete error');
    return false;
  }
};

export const deleteDriver = async (id: string): Promise<boolean> => {
  try {
    const response = await fetcher(`/vehicle/driver/${id}`, {
      method: 'DELETE',
    });
    return response?.status || false;
  } catch (error) {
    console.log(error, 'Driver delete error');
    return false;
  }
};

export const deleteBooking = async (id: string): Promise<boolean> => {
  try {
    const response = await fetcher(`/vehicle/booking/${id}`, {
      method: 'DELETE',
    });
    return response?.status || false;
    // return response?.success || false;
  } catch (error) {
    console.log(error, 'Booking delete error');
    return false;
  }
};
