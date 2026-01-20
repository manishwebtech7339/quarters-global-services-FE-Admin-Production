import React from 'react';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { ApostilleBookingSources } from '@/lib/types';
import ApostillePage from './Apostille';
import { getApostilleApplications } from '@/services/apostilleService';

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    bookingSource?: ApostilleBookingSources;
    q?: string;
    from?: string;
    to?: string;
    status?: string;
  }>;
}) => {
  const page = (await searchParams).page || '1';
  const bookingSource = (await searchParams).bookingSource || 'WALK_IN';
  const search = (await searchParams).q || '';
  const from = (await searchParams).from || '';
  const to = (await searchParams).to || '';
  const status = (await searchParams).status || '';

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.applications });
  if (!access) {
    return redirect('/admin/home');
  }

  const applications = await getApostilleApplications({
    page: page,
    bookingSource,
    isSubmittedFromApplication: '1',
    search,
    from,
    to,
    status,
  });
  return <ApostillePage applicationsData={applications} bookingSource={bookingSource} />;
};

export default page;
