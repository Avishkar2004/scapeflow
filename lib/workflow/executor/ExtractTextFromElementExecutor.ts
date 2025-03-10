import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      console.error("Element not found");
      return false;
    }

    const extracedText = $.text(element);
    if (!extracedText) {
      console.error("Element has no text");
      return false;
    }
 
    environment.setOutput("Extracted Text", extracedText);

    return true;
  } catch (error) {
    console.error("Failed to launch browser:", error);
    return false;
  }
}
