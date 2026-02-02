import React from 'react';
import { getSupportById } from '@/services/supportsService';
import { hasSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const ViewSupportPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await hasSession();

  if (!session?.id) {
    return redirect('/');
  }

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.support });
  if (!access) {
    return redirect('/admin/home');
  }

  const supportData = await getSupportById(id);

  if (!supportData) {
    return redirect('/admin/support');
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/admin/support">
            <ChevronLeft className="h-6 w-6 text-black" />
          </Link>
          <h1 className="text-2xl font-semibold">Support Details</h1>
        </div>
        <p className="text-gray-600">Support ID: #{supportData._id.slice(-8)}</p>
      </div>

      <div className="grid gap-6">
        {/* Support Information */}
        <div className="p-6 border rounded-lg">
          {/* <h2 className="text-lg font-semibold mb-4">Support Information</h2> */}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <h3 className="font-medium">{supportData.name}</h3>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-sm">{supportData.phone}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm">{supportData.email}</p>
                </div>
              </div>
            </div>

            {/* Support Details */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Support Type</label>
                <p className="text-sm">{supportData.supportType}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Created Date</label>
                <p className="text-sm">{formatDate(supportData.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                <p className="text-sm">{formatDate(supportData.updatedAt)}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Message</label>
              <p className="text-sm">{supportData.message || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSupportPage;
