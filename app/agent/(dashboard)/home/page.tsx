import React from 'react';
import Home from './Home';
import {
  getDashboardCounts,
  getDashboardUsage,
  getRecentActivities,
} from '@/services/dashboardService';

const page = async () => {
  // Fetch dashboard data and recent activities in parallel
  const [dashboardData, recentActivities, dashboardUsage] = await Promise.all([
    getDashboardCounts(),
    getRecentActivities(),
    getDashboardUsage(),
  ]);

  return (
    <Home
      dashboardData={dashboardData?.data || null}
      recentActivities={recentActivities}
      dashboardUsage={dashboardUsage}
    />
  );
};

export default page;
