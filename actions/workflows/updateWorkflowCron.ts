"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import parser from "cron-parser"; // ✅ Use default import
import { revalidatePath } from "next/cache";

export async function UpdateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  try {
    // ✅ Corrected function call
    const interval = parser.parse(cron, {
      currentDate: new Date(), // Ensure UTC-based parsing
    });

    return await prisma.workflow.update({
      where: { id, userId },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error: any) {
    console.error("Invalid cron:", error.message);
    throw new Error("Invalid cron expression");
  }

  revalidatePath("/workflows");
}
