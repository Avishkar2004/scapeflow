import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, TextIcon } from "lucide-react"; // ✅ Use LucideProps

export const ExtractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract text form element",
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-rose-400" {...props} /> // ✅ Pass correct props
  ),

  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;
