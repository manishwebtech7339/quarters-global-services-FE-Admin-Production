import ApplicationForm from '@/components/forms/applicationForm/ApplicationForm';
import React from 'react';
import Actions from './Actions';
import StatusTimeLine from './StatusTimeLine';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { getApplicationById } from '@/services/applicatonService';
import { ApplicationSource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    application?: string;
    isView?: string;
    search?: string;
    applicationSources?: ApplicationSource;
  }>;
}) => {
  const application = (await searchParams).application || '';
  const isView = (await searchParams).isView || '';

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.applications });
  if (!access) {
    return redirect('/admin/home');
  }

  const applicationData = await getApplicationById(application);

  if (!applicationData) {
    return 'no found';
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button size="icon" asChild variant="ghost">
          <Link href="/admin/applications">
            <ArrowLeft />
            <span className="sr-only">back</span>
          </Link>
        </Button>
        <p className="text-base font-semibold grow">Application ID: {application} </p>
        {isView ? (
          <Actions />
        ) : (
          <Button>
            <Edit /> Edit
          </Button>
        )}
      </div>

      <StatusTimeLine activeStatus={applicationData.status || 'Submitted'} />
      <ApplicationForm isEdit={true} isView={!!isView} applicationData={applicationData} />
    </div>
  );
};

export default page;
