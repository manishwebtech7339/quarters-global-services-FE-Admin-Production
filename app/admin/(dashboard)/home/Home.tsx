import Summary from './_components/Summary';
import Activities from './_components/Activities';
import ApplicationTrend from './_components/ApplicationTrend';
import ServiceWiseUsage from './_components/ServiceWiseUsage';
import { DashboardCounts, RecentActivity } from '@/services/dashboardService';

interface HomeProps {
  dashboardData: DashboardCounts | null;
  recentActivities: RecentActivity[];
}

const Home = ({ dashboardData, recentActivities }: HomeProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6 pb-10">
      {dashboardData && <Summary dashboardData={dashboardData} />}
      <ApplicationTrend />
      <ServiceWiseUsage />
      <Activities activities={recentActivities} />
      {/* <Alerts /> */}
    </div>
  );
};

export default Home;
