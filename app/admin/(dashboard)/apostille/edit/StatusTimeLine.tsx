import Timeline from '@/components/ui/timeline';
import { ApplicationStatus, applicationStatuses } from '@/lib/types';
import { Clock } from 'lucide-react';
import React from 'react';

const StatusTimeLine = ({ activeStatus }: { activeStatus: ApplicationStatus }) => {
  return (
    <Timeline
      steps={applicationStatuses.map((e) => ({
        id: e,
        title: e,
        status:
          activeStatus === e
            ? 'active'
            : applicationStatuses.indexOf(e) < applicationStatuses.indexOf(activeStatus)
              ? 'completed'
              : 'pending',
        icon: <Clock />,
      }))}
    />
  );
};

export default StatusTimeLine;
