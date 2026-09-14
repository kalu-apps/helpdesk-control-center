import { useTicketStore } from "../store/useTicketStore";
import { useDashboardAnalytics } from "../hooks/useDashboardAnalytics";
import LoadTimelineChart from "./dashboard/LoadTimelineChart";
import ExecutorEfficiencyChart from "./dashboard/ExecutorEfficiencyChart";
import StatusDistributionWidget from "./dashboard/StatusDistributionWidget";
import ExecutorRatingWidget from "./dashboard/ExecutorRatingWidget";

export default function Dashboard() {
  const { dashboardTimePeriod, setDashboardTimePeriod } = useTicketStore();
  const { counters, executorData, timelineData, pieData } =
    useDashboardAnalytics();

  const topFiveExecutorsForChart = executorData.slice(0, 5);

  return (

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full pb-8">
      <div className="xl:col-span-12 min-h-[340px]">
        <LoadTimelineChart
          timelineData={timelineData}
          timePeriod={dashboardTimePeriod}
          setTimePeriod={setDashboardTimePeriod}
        />
      </div>
      <div className="xl:col-span-8">
        <ExecutorEfficiencyChart executorData={topFiveExecutorsForChart} />
      </div>
      <div className="xl:col-span-4">
        <StatusDistributionWidget counters={counters} pieData={pieData} />
      </div>
      <div className="xl:col-span-12">
        <ExecutorRatingWidget executorData={executorData} />
      </div>
    </div>
  );
}
