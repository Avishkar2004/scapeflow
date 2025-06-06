"use client";

import { GetWorflowExecutionStatus } from "@/actions/analytics/GetWorflowExecutionStatus";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartColumnStackedIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";

type ChartData = Awaited<ReturnType<typeof GetCreditUsageInPeriod>>;

const chartConfig = {
  success: {
    label: "Successfull Phases Credits",
    color: "hsl(var(--chart-success))", // Updated Green Shade
  },
  failed: {
    label: "Failed Phases Credits",
    color: "hsl(var(--chart-failed))", // New Red Shade
  },
};

export default function CreditUsageChart({
  data,
  title,
  description,
}: {
  data: ChartData;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnStackedIcon
            className="w-6
             h-6 text-primary"
          />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              fillOpacity={0.8}
              radius={[0, 0, 4, 4]}
              fill="var(--color-success)"
              stroke="var(--color-success)"
              dataKey={"sucess"}
              stackId={"a"}
            />
            <Bar
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              dataKey={"failed"}
              stackId={"a"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
