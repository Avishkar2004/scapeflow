import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("selector not defined ");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("html not defined ");

      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      environment.log.error("element not found");
      return false;
    }

    const extracedText = $.text(element);
    if (!extracedText) {
      environment.log.error("element has no text");
      return false;
    }

    environment.setOutput("Extracted Text", extracedText);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
