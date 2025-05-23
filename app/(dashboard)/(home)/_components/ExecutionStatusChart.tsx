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
import { Layers2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetWorflowExecutionStatus>>;

const chartConfig = {
  success: {
    label: "Success",
    color: "hsl(var(--chart-success))", // Updated Green Shade
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-failed))", // New Red Shade
  },
};

export default function ExecutionStatusChart({ data }: { data: ChartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Layers2
            className="w-6
             h-6 text-primary"
          />
          Workflow Executioon Status
        </CardTitle>
        <CardDescription>
          Daily number of successfull and failed workflow executions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart
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
            <Area
              min={0}
              type={"natural"}
              fillOpacity={0.6}
              fill="var(--color-success)"
              stroke="var(--color-success)"
              dataKey={"sucess"}
              stackId={"a"}
            />
            <Area
              min={0}
              type={"natural"}
              fillOpacity={0.6}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              dataKey={"failed"}
              stackId={"a"}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
