import React from 'react';
import Documents from './Documents';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { getDocuments } from '@/services/documentService';

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; documentType?: string; tab?: string }>;
}) => {
  const params = await searchParams;
  const page = params.page || '1';
  const status = params.status || 'Resolved';
  const documentType = params.documentType || 'Other';
  const selectedTab = params.tab || 'online';

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.documents });
  if (!access) {
    return redirect('/admin/home');
  }

  const documents = await getDocuments({
    page,
    pageSize: '10',
    status,
    documentType,
  });
  return <Documents documentsData={documents} selectedTab={selectedTab} />;
};

export default page;
