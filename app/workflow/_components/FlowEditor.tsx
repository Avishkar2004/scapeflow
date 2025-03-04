"use client";

import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import { Workflow } from "@prisma/client";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "@/app/workflow/_components/nodes/NodeComponent";

const nodeType = {
  FlowScrapNode: NodeComponent,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    createFlowNode(TaskType.LAUNCH_BROWSER),
  ]);
  const [edges, setEdges, onEdgeChange] = useEdgesState([]);
  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgeChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeType}
        snapGrid={snapGrid}
        snapToGrid={true}
        fitView
        fitViewOptions={fitViewOptions}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions}/>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
