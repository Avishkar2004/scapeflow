import { Browser } from "puppeteer";

export type Environment = {
  browser?: Browser;
  // Phases with phaseId/taskId as key
  phases: Record<
    string, // Key: phaseId/taskId
    {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    }
  >;
};
