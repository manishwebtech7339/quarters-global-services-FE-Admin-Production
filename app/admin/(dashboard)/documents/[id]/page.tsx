import DocumentReminderForm from '@/components/forms/documentReminderForm/DocumentReminderForm';
import React from 'react';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { getDocumentById } from '@/services/documentService';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.documents });
  if (!access) {
    return redirect('/admin/home');
  }

  const document = await getDocumentById(id);

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center gap-2 justify-between">
        <p className="text-base font-semibold">Document Details</p>
      </div> */}
      <DocumentReminderForm document={document || undefined} />
    </div>
  );
};

export default page;
