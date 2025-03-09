import { waitFor } from "@/lib/helper/waitFor";
import puppeteer from "puppeteer";

export async function LaunchBrowserExecutor(): Promise<boolean> {
  try {
    const browser = await puppeteer.launch({
      headless: false, // Run with UI to see errors
    });

    await waitFor(5000); // Wait for 5 seconds to see if the browser actually opens

    await browser.close();
    return true;
  } catch (error) {
    console.error("Failed to launch browser:", error);
    return false;
  }
}
