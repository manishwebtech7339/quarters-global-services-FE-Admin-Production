import React from 'react';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import TaxBureau from './TaxBureau';
import { getTaxBureau } from '@/services/taxBureauService';

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; from?: string; to?: string; status?: string }>;
}) => {
  const page = (await searchParams).page || '1';
  const search = (await searchParams).q || '';
  const from = (await searchParams).from || '';
  const to = (await searchParams).to || '';
  const status = (await searchParams).status || '';

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.tax_bureau });
  if (!access) {
    return redirect('/agent/home');
  }

  const data = await getTaxBureau({ page, search, from, to, status });

  return <TaxBureau data={data} />;
};

export default page;
