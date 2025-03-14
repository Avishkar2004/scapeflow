"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { ExecutionWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExectionPhaseStatus,
  WorkflowExecutionTrigger,
  WorkFlowExecutionPlan,
  WorkflowExecutionStatus,
  WorkFlowStatus,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error("workflowId is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) {
    throw new Error("workflow not found");
  }
  let executionPlan: WorkFlowExecutionPlan;
  let workflowDefinition = flowDefinition;

  if (workflow.status === WorkFlowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error("no execution plan found in published workflow  ");
    }
    executionPlan = JSON.parse(workflow.executionPlan);
    workflowDefinition = workflow.definition;
  } else {
    // workflow is a draft
    if (!flowDefinition) {
      throw new Error("flow definition is not defined");
    }

    let flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);
    if (result.error) {
      throw new Error("Flow definition not valid");
    }

    if (!result.executionPlan) {
      throw new Error("no execution plan generated");
    }

    executionPlan = result.executionPlan;
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            const task = TaskRegistry[node.data.type];
            if (!task) {
              throw new Error(
                `Task type ${node.data.type} not found in registry`
              );
            }
            return {
              userId,
              status: ExectionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: task.label,
            };
          });
        }),
      },
    },
    select: { id: true, phases: true },
  });

  if (!execution) throw new Error("Workflow execution not created");

  ExecutionWorkflow(execution.id); // run this on background

  // Instead of redirecting here, return the redirect URL
  return {
    success: true,
    redirectUrl: `/workflow/runs/${workflowId}/${execution.id}`,
  };
}
