// app/(dashboard)/(home)/page.tsx

import React, { Suspense } from "react";
import { GetPeriod } from "@/actions/analytics/getPeriod";
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

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const currentDate = new Date();
  const resolvedParams = await searchParams;

  const monthParam =
    typeof resolvedParams?.month === "string"
      ? resolvedParams.month
      : Array.isArray(resolvedParams?.month)
      ? resolvedParams.month[0]
      : undefined;

  const yearParam =
    typeof resolvedParams?.year === "string"
      ? resolvedParams.year
      : Array.isArray(resolvedParams?.year)
      ? resolvedParams.year[0]
      : undefined;

  const month = monthParam ? parseInt(monthParam) : currentDate.getMonth();
  const year = yearParam ? parseInt(yearParam) : currentDate.getFullYear();

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
      title="Daily Credits spent"
      description="Daily credit consumed in selected period"
    />
  );
}
