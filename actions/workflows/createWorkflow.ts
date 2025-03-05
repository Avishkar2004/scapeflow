"use server";

import prisma from "@/lib/prisma";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkFlowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export async function CreateWorkFLow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("unathenticated");
  }

  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  // Lets add the flow entry point
  initialFlow.nodes.push(createFlowNode(TaskType.LAUNCH_BROWSER));

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkFlowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  });

  if (!result) {
    throw new Error("failed to create workflow");
  }
  redirect(`/workflow/editor/${result.id}`);
}
