import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import React from 'react';

const Actions = () => {
  return (
    <div className="flex items-center gap-2">
      <Button>Generate Cover Letter</Button>
      <Button>
        <Printer /> Print
      </Button>
    </div>
  );
};

export default Actions;
