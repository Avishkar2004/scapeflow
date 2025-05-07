import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Editor from "../../_components/Editor";

type Props = {
  params: { [key: string]: string | string[] | undefined }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ params }: Props) {
  const workflowId = params.workflowId as string;
  if (!workflowId) return <div>Missing workflow ID</div>;

  const { userId } = await auth();
  if (!userId) return <div>Unauthenticated</div>;

  const workflow = await prisma?.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    return <div>Workflow not found.</div>;
  }

  return <Editor workflow={workflow} />;
}
