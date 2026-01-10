import { fetcher } from '@/lib/fetcher';

export interface DashboardCounts {
  totalApplications: number;
  applicationByStatus: number;
  pendingApprovals: number;
  status: string;
  todaysSubmission: number;
  totalRevenue: number;
}

export interface DashboardCountsResponse {
  status: boolean;
  message: string;
  data: DashboardCounts;
}

export const getDashboardCounts = async (): Promise<DashboardCountsResponse | null> => {
  try {
    const response = await fetcher('/dashboard/counts', {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    return null;
  }
};

// Trend data types based on the API response
export interface TrendDataPoint {
  monthNumber: number;
  month: string;
  totalCount: number;
}

export interface TrendResponse {
  status: boolean;
  message: string;
  data: {
    trends: TrendDataPoint[];
  };
}

export interface TrendParams {
  year: string;
  service?: string;
  country?: string;
}

export const getTrendData = async ({
  year,
  service,
  country,
}: TrendParams): Promise<TrendDataPoint[]> => {
  try {
    const queryParams = new URLSearchParams({
      year,
    });

    // Add optional parameters if provided
    if (service && service !== 'all') {
      queryParams.set('service', service);
    }

    if (country && country !== 'all') {
      queryParams.set('country', country);
    }

    const response: TrendResponse = await fetcher(`/dashboard/trend?${queryParams.toString()}`, {
      cache: 'no-cache',
      revalidate: 60,
    });

    // Return the trends array from the API response
    if (response?.status && response?.data?.trends) {
      return response.data.trends;
    }

    // Return empty array if no data
    return [];
  } catch (error) {
    console.log(error, 'Trend data fetch error');
    return [];
  }
};

// Helper function to transform API data for chart consumption
export const transformTrendDataForChart = (trends: TrendDataPoint[]) => {
  return trends.map((trend) => ({
    month: trend.month,
    value: trend.totalCount,
    monthNumber: trend.monthNumber,
  }));
};

// Recent Activities types based on the API response
export interface RecentActivity {
  _id: string;
  platformServiceId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  status: string;
}

export interface RecentActivitiesResponse {
  status: boolean;
  message: string;
  data: RecentActivity[];
}

export const getRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    const response: RecentActivitiesResponse = await fetcher('/dashboard/recent-activities', {
      cache: 'no-cache',
      revalidate: 60,
    });

    // Return the activities array from the API response
    if (response?.status && response?.data) {
      return response.data;
    }

    // Return empty array if no data
    return [];
  } catch (error) {
    console.log(error, 'Recent activities fetch error');
    return [];
  }
};

// Dashboard Usage types based on the API response

export interface DashboardUsageDataType {
  _id: string;
  name: string;
  percentage: number;
  totalApplications: number;
}
export const getDashboardUsage = async (): Promise<DashboardUsageDataType[] | null> => {
  try {
    const response = await fetcher('/dashboard/usage', {
      method: 'GET',
    });
    return response?.data?.result || null;
  } catch (error) {
    console.error('Error fetching dashboard usage:', error);
    return null;
  }
};
