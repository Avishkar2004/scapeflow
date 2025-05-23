"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import cronstrue from "cronstrue";
import parser from "cron-parser";
import { RemoveWorkflowSchedule } from "@/actions/workflows/removeWorkflowSchedule";
import { Separator } from "@/components/ui/separator";

export default function SchedulerDialog(props: {
  cron: string | null;
  workflowId: string;
  setCron: (cron: string | null) => void; // Accept setCron from parent
}) {
  const [cron, setCronState] = useState(props.cron || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule updated successfully", { id: "cron" });
      props.setCron(cron); // Update parent state
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" });
    },
  });

  const removeSchedulermutation = useMutation({
    mutationFn: RemoveWorkflowSchedule,
    onSuccess: () => {
      toast.success("Schedule removed successfully", { id: "cron" });
      props.setCron(null); // Update parent state to remove schedule
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" });
    },
  });

  useEffect(() => {
    try {
      parser.parse(cron);
      const humanCronstr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronstr);
    } catch (error) {
      setValidCron(false);
    }
  }, [cron]);

  const workflowHasValidCron = props.cron && props.cron.length > 0;
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(props.cron!);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary"
          )}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="w-3 h-3" /> Set Schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify a cron expression to schedule periodic workflow execution.
            All times are in UTC
          </p>
          <Input
            placeholder="E.g. * * * * *"
            value={cron}
            onChange={(e) => setCronState(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm border-destructive text-destructive",
              validCron && "border-primary text-primary"
            )}
          >
            {validCron ? readableCron : "Not a valid cron expression"}
          </div>

          {workflowHasValidCron && (
            <DialogClose asChild>
              <div>
                <Button
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  variant={"outline"}
                  disabled={
                    mutation.isPending || removeSchedulermutation.isPending
                  }
                  onClick={() => {
                    toast.loading("Removing schedule...", { id: "cron" });
                    removeSchedulermutation.mutate(props.workflowId);
                  }}
                >
                  Remove current Schedule
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button variant={"secondary"} className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="w-full"
              disabled={mutation.isPending || !validCron}
              onClick={() => {
                toast.loading("Saving...", { id: "cron" });
                mutation.mutate({
                  id: props.workflowId,
                  cron,
                });
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
