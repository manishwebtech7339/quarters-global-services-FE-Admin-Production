import React from 'react';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import TaxBureauForm from '@/components/forms/taxBureauForm/TaxBureauForm';
import { getTaxBureauById } from '@/services/taxBureauService';

const EditTaxBureauPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.tax_bureau });
  if (!access) {
    return redirect('/admin/home');
  }

  // Fetch   data and dropdown data in parallel
  const [taxBureauData] = await Promise.all([getTaxBureauById(id)]);

  if (!taxBureauData) {
    return redirect('/admin/tax-bureau');
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2 ">
          <Link href="/admin/tax-bureau">
            <ChevronLeft className="h-6 w-6 text-black" />
          </Link>
          <h1 className="text-2xl font-semibold">Edit</h1>
        </div>
      </div>
      <TaxBureauForm defaultData={taxBureauData} isEdit={true} />
    </div>
  );
};

export default EditTaxBureauPage;
