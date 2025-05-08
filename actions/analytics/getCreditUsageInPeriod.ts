"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { ExectionPhaseStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<
  string,
  {
    sucess: number;
    failed: number;
  }
>;

const { COMPLETED, FAILED } = ExectionPhaseStatus;

export async function GetCreditUsageInPeriod(period: Period) {
  const { userId } = await auth();

  // Return empty data for unauthenticated users
  if (!userId) {
    const dateRange = PeriodToDateRange(period);
    return eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate,
    }).map((date) => ({
      date: format(date, "yyyy-MM-dd"),
      sucess: 0,
      failed: 0,
    }));
  }

  const dateRange = PeriodToDateRange(period);
  const executionPhase = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
      },
    },
  });

  const dateFormat = "yyyy-MM-dd";

  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        sucess: 0,
        failed: 0,
      };
      return acc;
    }, {} as any);

  executionPhase.forEach((phase) => {
    const date = format(phase.startedAt!, dateFormat);
    if (phase.status === COMPLETED) {
      stats[date].sucess += phase.creditsConsumed || 0;
    }

    if (phase.status === FAILED) {
      stats[date].failed += phase.creditsConsumed || 0;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));
  return result;
}
