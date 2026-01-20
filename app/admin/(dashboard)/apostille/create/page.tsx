import ApostilleForm from '@/components/forms/apostilleForm/ApostilleForm';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async () => {
  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.apostille });
  if (!access) {
    return redirect('/admin/home');
  }

  return <ApostilleForm />;
};

export default page;
