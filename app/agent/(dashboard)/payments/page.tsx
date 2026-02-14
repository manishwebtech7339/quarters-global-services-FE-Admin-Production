import React from 'react';
import Payments from './Payments';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { redirect } from 'next/navigation';
import { getTransactions } from '@/services/transactionService';

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; from?: string; to?: string }>;
}) => {
  const page = (await searchParams).page || '1';
  const search = (await searchParams).q || '';
  const from = (await searchParams).from || '';
  const to = (await searchParams).to || '';

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.payments });
  if (!access) {
    return redirect('/admin/home');
  }

  // Fetch customers data
  const data = await getTransactions({ page, search, from, to });
  return <Payments transactionsData={data} />;
};

export default page;
