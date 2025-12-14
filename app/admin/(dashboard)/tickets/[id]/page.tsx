import React from 'react';
import TicketForm from '@/components/forms/ticketForm/TicketForm';
import { getTicketById } from '@/services/ticketsService';
import { getAllCustomers } from '@/services/customerService';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getAgents } from '@/services/agencyService';

const EditTicketPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.tickets });
  if (!access) {
    return redirect('/admin/home');
  }

  // Fetch ticket data and dropdown data in parallel
  const [ticketData] = await Promise.all([getTicketById(id)]);

  if (!ticketData) {
    return redirect('/admin/tickets');
  }

  const [customersResponse, staffResponse] = await Promise.all([
    getAllCustomers({ search: ticketData.customer || '', page: '1' }),
    getAgents({ search: ticketData.assignedStaff || '', page: '1' }),
  ]);

  // Filter customers to only include users with role 'user'
  const customers = customersResponse.data?.data?.filter((user) => user.role === 'user') || [];
  const staff = staffResponse.data || [];

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2 ">
          <Link href="/admin/tickets">
            <ChevronLeft className="h-6 w-6 text-black" />
          </Link>
          <h1 className="text-2xl font-semibold">View Ticket</h1>
        </div>
      </div>
      <TicketForm
        isView
        ticketData={ticketData}
        isEdit={true}
        customers={customers}
        staff={staff}
      />
    </div>
  );
};

export default EditTicketPage;
