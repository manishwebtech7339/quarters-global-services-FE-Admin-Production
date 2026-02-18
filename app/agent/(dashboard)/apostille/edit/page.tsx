import ApostilleForm from '@/components/forms/apostilleForm/ApostilleForm';
import { ApostilleApplicationDataType } from '@/lib/types';
import React from 'react';

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    application?: string;
    init: string;
  }>;
}) => {
  const initData = (await searchParams).init || '';
  const initDataParse = JSON.parse(initData) as ApostilleApplicationDataType;

  return <ApostilleForm defaultValues={initDataParse} isEdit isAgent={true} />;
};

export default page;
