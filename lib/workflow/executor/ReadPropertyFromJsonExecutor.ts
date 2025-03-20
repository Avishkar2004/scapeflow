import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJsonTask";

export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> {
  try {
    const jsonData = environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("input-> jsonData is not defined");
    }

    const propertyname = environment.getInput("Property name");
    if (!propertyname) {
      environment.log.error("input-> propertyname is not defined");
    }

    const json = JSON.parse(jsonData);
    const propertyValue = json[propertyname];

    if (propertyValue === undefined) {
      environment.log.error("Property not found");
      return false;
    }

    environment.setOutput("Property value", propertyValue);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
