import { fetcher } from '@/lib/fetcher';

export interface Country {
  _id: string;
  name: string;
  code?: string;
  slug?: string;
  [key: string]: any;
}

export interface CountryListResponse {
  status: boolean;
  message: string;
  data: {
    data: Country[];
    totalPages?: number;
    total?: number;
  };
}

export const getCountries = async (
  page = 1,
  pageSize = 256,
  search?: string,
): Promise<Country[]> => {
  try {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) params.set('search', search);

    const url = `/country/get-country?${params.toString()}`;
    const res: CountryListResponse = await fetcher(url, { method: 'GET' });

    if (res?.status && res?.data?.data) {
      return res.data.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

export default getCountries;
