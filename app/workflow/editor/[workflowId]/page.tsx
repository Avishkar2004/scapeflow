import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Editor from "../../_components/Editor";

type PageProps = {
  params: Promise<{
    workflowId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  if (!resolvedParams.workflowId) return <div>Missing workflow ID</div>;

  const { userId } = await auth();
  if (!userId) return <div>Unauthenticated</div>;

  const workflow = await prisma?.workflow.findUnique({
    where: {
      id: resolvedParams.workflowId,
      userId,
    },
  });

  if (!workflow) {
    return <div>Workflow not found.</div>;
  }

  return <Editor workflow={workflow} />;
}
