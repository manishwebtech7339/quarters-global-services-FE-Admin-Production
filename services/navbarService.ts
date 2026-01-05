import { fetcher } from '@/lib/fetcher';

export interface NavbarServiceItem {
  _id: string;
  parentServiceId?: string | null;
  name: string;
  displayName?: string;
  iconUrl?: string;
  slug?: string;
  subServices?: NavbarServiceItem[];
  [key: string]: any;
}

export interface NavbarServicesResponse {
  status: boolean;
  message: string;
  data: NavbarServiceItem[];
}

export const getNavbarServices = async (): Promise<any[]> => {
  try {
    const url = `/platform-service/get-navbar-services`;
    const res: NavbarServicesResponse = await fetcher(url, { method: 'GET' });
    console.log('Navbar services response:', res);
    if (res?.status) {
      return res.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching navbar services:', error);
    return [];
  }
};

export default getNavbarServices;
