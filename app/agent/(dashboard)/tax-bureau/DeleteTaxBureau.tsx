'use client';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import Icon from '@/components/common/Icon';
import handleAsync from '@/lib/handleAsync';
import { deleteTaxBureau } from '@/services/taxBureauService';
import React, { useState } from 'react';
import { toast } from 'sonner';

const DeleteTaxBureau = ({ id }: { id: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = handleAsync(async () => {
    try {
      setIsLoading(true);
      await deleteTaxBureau(id);
      toast.success('Tax Deleted Successfully');
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <DeleteConfirm onConfirm={handleDelete}>
      <Icon name={isLoading ? 'loading' : 'delete'} />
    </DeleteConfirm>
  );
};

export default DeleteTaxBureau;
