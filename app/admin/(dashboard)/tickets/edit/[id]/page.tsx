import React from 'react';
import TicketForm from '@/components/forms/ticketForm/TicketForm';
import { getTicketById } from '@/services/ticketsService';
import { getAllCustomers } from '@/services/customerService';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getUsers } from '@/services/usersService';
import { UserTypeENUM } from '@/lib/types';
import { getApplications } from '@/services/applicatonService';

const EditTicketPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.tickets });
  if (!access) {
    return redirect('/admin/home');
  }

  // Fetch ticket data and dropdown data in parallel
  const ticketData = await getTicketById(id);
  if (!ticketData) {
    return redirect('/admin/tickets');
  }

  const [customersResponse, staffResponse, applicationResponse] = await Promise.all([
    getAllCustomers({ search: ticketData.customer?._id || '', page: '1' }),
    getUsers({ search: ticketData.assignedStaff || '', page: '1', role: UserTypeENUM.SUBADMIN }),
    getApplications({ search: ticketData.applicationId || '', page: '1', applicationSources: '' }),
  ]);

  // Filter customers to only include users with role 'user'
  const customers = customersResponse.data?.data?.filter((user) => user.role === 'user') || [];
  const staff = staffResponse.data || [];
  const applications = applicationResponse.data || [];

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2 ">
          <Link href="/admin/tickets">
            <ChevronLeft className="h-6 w-6 text-black" />
          </Link>
          <h1 className="text-2xl font-semibold">Edit Ticket</h1>
        </div>
      </div>
      <TicketForm
        ticketData={ticketData}
        isEdit={true}
        customers={customers}
        staff={staff}
        applications={applications}
      />
    </div>
  );
};

export default EditTicketPage;
