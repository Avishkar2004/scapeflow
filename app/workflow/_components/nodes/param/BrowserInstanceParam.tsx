"use client";

import { TaskParam } from "@/types/task";
import React from "react";

export default function BrowserInstanceParam({
  param,
  value,
  updateNodeParamValue,
}: {
  param: TaskParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
}) {
  return <p className="text-xs">{param.name}</p>;
}
