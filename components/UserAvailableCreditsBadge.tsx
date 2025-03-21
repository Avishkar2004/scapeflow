"use client";

import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Link from "next/link";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactCountUpWrapper from "./ReactCountUpWrapper";
import { buttonVariants } from "./ui/button";

function UserAvailableCreditsBadge() {
  const query = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: () => GetAvailableCredits(),
    refetchInterval: 30 * 1000,
  });
  return (
    <Link
      href={"/billing"}
      className={cn(
        "w-full space-x-2 items-center",
        buttonVariants({ variant: "outline" })
      )}
    >
      <CoinsIcon size={20} className="text-primary" />
      <span className="font-semibold  capitalize">
        {query.isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
        {!query.isLoading && query.data !== undefined && query.data >= 0 && (
          <ReactCountUpWrapper value={query.data} />
        )}
        {!query.isLoading &&
          (query.data === undefined || query.data < 0) &&
          "0"}
      </span>
    </Link>
  );
}

export default UserAvailableCreditsBadge;
