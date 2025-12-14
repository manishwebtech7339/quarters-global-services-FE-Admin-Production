import TicketForm from '@/components/forms/ticketForm/TicketForm';
import React from 'react';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';

const page = async () => {
  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.tickets });
  if (!access) {
    return redirect('/admin/home');
  }

  return (
    <div>
      <TicketForm />
    </div>
  );
};

export default page;
