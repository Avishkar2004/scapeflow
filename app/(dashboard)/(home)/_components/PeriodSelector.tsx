"use client";

import { Period } from "@/types/analytics";
import { useRouter, useSearchParams } from "next/navigation";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function PeriodSelector({
  periods,
  SelectedPeriod,
}: {
  periods: Period[];
  SelectedPeriod: Period;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <Select
      value={`${SelectedPeriod.month}-${SelectedPeriod.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        params.set("year", year);
        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => (
          <SelectItem key={index} value={`${period.month}-${period.year}`}>{`${
            MONTH_NAMES[period.month]
          } ${period.year}`}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
