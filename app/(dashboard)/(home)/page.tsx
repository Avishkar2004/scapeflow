import { GetPeriod } from "@/actions/analytics/getPeriod";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardsValues } from "@/actions/analytics/getStatsCardsValues";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import StatsCard from "./_components/StatsCard";
import { GetWorflowExecutionStatus } from "@/actions/analytics/GetWorflowExecutionStatus";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";
import CreditUsageChart from "../billing/_components/CreditUsageChart";

type Props = {
  params: { [key: string]: string | string[] | undefined }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function HomePage({ searchParams }: Props) {
  const currentDate = new Date();

  // Ensure searchParams is awaited
  const month = searchParams?.month
    ? parseInt(searchParams.month as string)
    : currentDate.getMonth();
  const year = searchParams?.year
    ? parseInt(searchParams.year as string)
    : currentDate.getFullYear();

  const period: Period = { month, year };

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper SelectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkelton />}>
          <StatsCards SelectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectperiod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsageInPeriod selectperiod={period} />
        </Suspense>
      </div>
    </div>
  );
}

async function PeriodSelectorWrapper({
  SelectedPeriod,
}: {
  SelectedPeriod: Period;
}) {
  const periods = await GetPeriod();
  return <PeriodSelector SelectedPeriod={SelectedPeriod} periods={periods} />;
}

async function StatsCards({ SelectedPeriod }: { SelectedPeriod: Period }) {
  const data = await GetStatsCardsValues(SelectedPeriod);
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow executions"
        value={data.workflowExecution}
        icon={CirclePlayIcon}
      />

      <StatsCard
        title="Phase executions"
        value={data.phaseExecutions}
        icon={WaypointsIcon}
      />

      <StatsCard
        title="Credits consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
}

function StatsCardSkelton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full min-h-[120px]" />
      ))}
    </div>
  );
}

async function StatsExecutionStatus({
  selectperiod,
}: {
  selectperiod: Period;
}) {
  const data = await GetWorflowExecutionStatus(selectperiod);
  return <ExecutionStatusChart data={data} />;
}

async function CreditsUsageInPeriod({
  selectperiod,
}: {
  selectperiod: Period;
}) {
  const data = await GetCreditUsageInPeriod(selectperiod);
  return (
    <CreditUsageChart
      data={data}
      title="Daily Credits pent"
      description="Daily credit consumed in selected period"
    />
  );
}
