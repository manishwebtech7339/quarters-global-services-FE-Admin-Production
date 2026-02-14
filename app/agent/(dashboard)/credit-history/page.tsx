import React from 'react';
import { getAgenciesUsedCreditsTransitions } from '@/services/agencyService';
import CreditHistory from './CreditHistory';

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    from?: string;
    to?: string;
    q?: string;
  }>;
}) => {
  const { page = '1', to = '', from = '', q = '' } = await searchParams;

  const agencyUsedCreditsTransitions = await getAgenciesUsedCreditsTransitions({
    page,
    from,
    to,
    search: q,
  });

  return (
    <CreditHistory
      data={agencyUsedCreditsTransitions.data}
      totalPages={agencyUsedCreditsTransitions.totalPages}
    />
  );
};

export default page;
