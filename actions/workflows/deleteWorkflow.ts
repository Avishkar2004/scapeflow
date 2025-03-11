"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function DeleteWorkFlow(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unathenticated");
  }

  await prisma.workflow.delete({
    where: {
      id,
      userId,
    },
  });
  revalidatePath("/workflows");
}
