import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import { DashboardCounts } from '@/services/dashboardService';

interface SummaryProps {
  dashboardData: DashboardCounts;
}

const Summary = ({ dashboardData }: SummaryProps) => {
  const summaryCards = [
    {
      key: 'total_applications',
      label: 'Total Applications',
      value: dashboardData.totalApplications,
    },
    // {
    //   key: 'applications_by_status',
    //   label: 'Applications by Status',
    //   value: dashboardData.applicationByStatus,
    // },
    {
      key: 'todays_submission',
      label: "Today's Submission",
      value: dashboardData.todaysSubmission,
    },
    // {
    //   key: 'pending_approvals',
    //   label: 'Pending Approvals',
    //   value: dashboardData.pendingApprovals,
    // },
    {
      key: 'total_revenue',
      label: 'Total Revenue',
      value: dashboardData.totalRevenue,
      isRevenue: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 lg:col-span-2 mb-3">
      {summaryCards.map((card) => (
        <Card key={card.key + 'summary-card'} className="bg-secondary border-0">
          <CardContent className="space-y-2">
            <p className="text-base capitalize">{card.label}</p>
            <p className="text-2xl font-semibold">
              {card.isRevenue ? `$${card.value.toLocaleString()}` : card.value.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Summary;
