import React from 'react';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import TaxBureau from './TaxBureau';
import { getTaxBureau } from '@/services/taxBureauService';

const page = async ({ searchParams }: { searchParams: Promise<{ page?: string }> }) => {
  const page = (await searchParams).page || '1';

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.tax_bureau });
  if (!access) {
    return redirect('/admin/home');
  }
  const data = await getTaxBureau();
  return <TaxBureau data={data} />;
};

export default page;
