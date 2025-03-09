import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { ExectionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { TaskType } from "@/types/task";
import { ExecuteRegistry } from "./executor/registry";
import { Environment } from "@/types/executor";

export async function ExecutionWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }
  // TODO: setup execution environment
  const environment: Environment = {
    phases: {},
  };

  await initializeWorkflowExecution(executionId, execution.workflowId);

  // TODO: initialize workflow status
  await initializePhaseStatuses(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    // TODO: consumed credits

    const executionPhase = await executeWorkflowPhase(phase, environment);
    if (!executionPhase.success) {
      executionFailed = true;
      break;
    }
  }

  // TODO: finalize execution
  await finalizedExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );
  // TODO: clean up environment

  revalidatePath("/workflow/runs");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });
  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

async function initializePhaseStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExectionPhaseStatus.PENDING, // ✅ Fix: Correct status for phases
    },
  });
}

async function finalizedExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });
  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((e) => {
      // Ignore
      // this means that we have tirggered other runs for this workflow
      // While an execution is running
      //
    });
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment
) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  setupEnviromentForPhase(node, environment);

  // Update phase status
  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExectionPhaseStatus.RUNNING,
      startedAt,
    },
  });
  const creditsRequired = TaskRegistry[node.data.type].credits;
  // console.log(
  //   `execution phase ${phase.name} with ${creditsRequired} credits required`
  // );

  // TODO: decrement user balance (with required credits)
  const success = await executePhase(phase, node, environment);

  await finalizePhase(phase.id, success);
  return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
  const finalStatus = success
    ? ExectionPhaseStatus.COMPLETED
    : ExectionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment
): Promise<boolean> {
  // ✅ Corrected syntax
  const runFn = ExecuteRegistry[node.data.type];
  if (!runFn) {
    return false;
  }
  return await runFn(environment.phases[node.id]);
}

function setupEnviromentForPhase(node: AppNode, environment: Environment) {
  environment.phases[node.id] = { inputs: {}, outputs: {} };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // Get input value from outputs in the environment



  }
}
