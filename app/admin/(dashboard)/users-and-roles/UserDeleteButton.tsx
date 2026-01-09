'use client';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import Icon from '@/components/common/Icon';
import handleAsync from '@/lib/handleAsync';
import { deleteUser } from '@/services/usersService';
import { useState } from 'react';
import { toast } from 'sonner';

export function UserDeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = handleAsync(async () => {
    try {
      setLoading(true);
      await deleteUser(id);

      toast.success(`User deleted successfully`);
    } finally {
      setLoading(false);
    }
  });

  return (
    <DeleteConfirm onConfirm={handleDelete}>
      <Icon name={loading ? 'loading' : 'delete'} disabled={loading} />
    </DeleteConfirm>
  );
}

export default UserDeleteButton;
