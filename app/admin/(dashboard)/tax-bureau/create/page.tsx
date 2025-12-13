import React from 'react';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import TaxBureauForm from '@/components/forms/taxBureauForm/TaxBureauForm';

const page = async () => {
  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.tax_bureau });
  if (!access) {
    return redirect('/admin/home');
  }

  return <TaxBureauForm />;
};

export default page;
