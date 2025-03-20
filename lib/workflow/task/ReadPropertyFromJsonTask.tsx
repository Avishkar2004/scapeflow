import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FileJson2Icon, MousePointerClick } from "lucide-react"; // ✅ Use LucideProps

export const ReadPropertyFromJsonTask = {
  type: TaskType.READ_PROPERT_FROM_JSON,
  label: "Read Propert From JSON",
  icon: (props) => <FileJson2Icon className="stroke-orange-400" {...props} />,

  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "JSON",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Property name",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Property value",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
