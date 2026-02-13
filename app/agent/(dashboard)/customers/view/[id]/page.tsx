import CustomerForm from '@/components/forms/customerForm/CustomerForm';
import React from 'react';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { getCustomerById } from '@/services/customerService';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { UserTypeENUM } from '@/lib/types';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.users });
  if (!access) {
    return redirect('/agent/home');
  }

  const customerData = await getCustomerById(id);

  if (!customerData || customerData.role !== 'user') {
    return redirect('/agent/customers');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Link href="/agent/customers">
            <ChevronLeft className="h-6 w-6 text-black" />
          </Link>
          <p className="text-base font-semibold">
            Customer: {customerData.firstName} {customerData.lastName}
          </p>
        </div>
        {/* <Actions /> */}
      </div>
      <CustomerForm customerData={customerData} isView={true} role={UserTypeENUM.AGENT} />
      {/* <Applications /> */}
    </div>
  );
};

export default page;
