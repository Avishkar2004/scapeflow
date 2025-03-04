import { TaskParamType, TaskType } from "@/types/task";
import { GlobeIcon, LucideProps } from "lucide-react"; // ✅ Use LucideProps

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch browser",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} /> // ✅ Pass correct props
  ),

  isEntryPoint: true,
  inputs: [
    {
      name: "website Url",
      type: TaskParamType.STRING,
      helperText: "eg: https://www.google.com",
      required: true,
      hideHandle: false,
    },
  ],
};
