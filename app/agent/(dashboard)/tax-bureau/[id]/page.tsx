import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import TaxBureauForm from '@/components/forms/taxBureauForm/TaxBureauForm';
import { getTaxBureauById } from '@/services/taxBureauService';

const ViewTaxBureauPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Fetch data
  const [taxBureauData] = await Promise.all([getTaxBureauById(id)]);

  if (!taxBureauData) {
    return redirect('/agent/tax-bureau');
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2 ">
          <Link href="/agent/tax-bureau">
            <ChevronLeft className="h-6 w-6 text-black" />
          </Link>
          <h1 className="text-2xl font-semibold">View</h1>
        </div>
      </div>
      <TaxBureauForm defaultData={taxBureauData} isView={true} isAgent={true} />
    </div>
  );
};

export default ViewTaxBureauPage;
