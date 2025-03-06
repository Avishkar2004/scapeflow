import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Editor from "../../_components/Editor";

async function Page({ params }: { params: { workflowId?: string } }) {
  // ✅ Use 'params' instead of 'param'
  if (!params?.workflowId) return <div>Missing workflow ID</div>;

  const { userId } = await auth(); // ✅ Await auth() properly
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
