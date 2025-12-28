'use server';
import { fetcher } from '@/lib/fetcher';

export const getShippingServices = async (): Promise<any> => {
  try {
    const data = await fetcher('/application-shipping/get-shipping-services', {
      cache: 'no-cache',
      revalidate: 60,
    });
    return data?.data || undefined;
  } catch (error) {
    console.log(error, 'Shipping services fetch error');
    return undefined;
  }
};

export const getShippingServicesQuote = async (payload: {
  carrierCode: string;
  serviceCode: string;
  packageTypeCode: string;
  sender: { country: string; zip: string };
}): Promise<any> => {
  try {
    const data = await fetcher('/application-shipping/get-shipping-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
    return data?.data || undefined;
  } catch (error) {
    console.log(error, 'Shipping services fetch error');
    return undefined;
  }
};

export const createApplicationShipping = async (payload: {
  applicationIds: string[];
  carrierCode: string;
  packageTypeCode: string;
  totalAmount: number;
  sender: {
    name: string;
    company: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    email: string;
  };
}): Promise<any> => {
  try {
    const data = await fetcher('/application-shipping/create-application-shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
    return data?.data || undefined;
  } catch (error) {
    console.log(error, 'Shipping services fetch error');
    return undefined;
  }
};
