import React from 'react';
import {
  getAgenciesAddCreditsTransitions,
  getAgenciesUsedCreditsTransitions,
} from '@/services/agencyService';
import Payments from './Payments';

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    from?: string;
    to?: string;
  }>;
}) => {
  const { page = '1', to = '', from = '' } = await searchParams;

  const agencyAddCreditsTransitions = await getAgenciesAddCreditsTransitions({
    page,
    from,
    to,
  });
  const agencyUsedCreditsTransitions = await getAgenciesUsedCreditsTransitions({
    page,
    from,
    to,
  });

  return <Payments />;
};

export default page;
// getAgenciesAddCreditsTransitions
