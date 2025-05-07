import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Editor from "../../_components/Editor";

interface PageProps {
  params: {
    workflowId: string;
  };
}
async function Page({ params }: PageProps) {
  if (!params?.workflowId) return <div>Missing workflow ID</div>;

  const { userId } = await auth();
  if (!userId) return <div>Unauthenticated</div>;

  const workflow = await prisma?.workflow.findUnique({
    where: {
      id: params.workflowId,
      userId,
    },
  });

  if (!workflow) {
    return <div>Workflow not found.</div>;
  }

  return <Editor workflow={workflow} />;
}

export default Page;
