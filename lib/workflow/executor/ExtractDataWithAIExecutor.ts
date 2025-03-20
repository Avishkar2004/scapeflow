import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("input->credentials is not defined");
      return false;
    }

    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("input->prompt is not defined");
      return false;
    }

    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("input->content is not defined");
      return false;
    }

    const credential = await prisma.credential.findUnique({
      where: { id: credentials },
    });

    if (!credential) {
      environment.log.error("credential not found");
      return false;
    }

    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) {
      environment.log.error("cannot decrypt credentials");
      return false;
    }

    // ✅ Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(plainCredentialValue);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // ✅ Removed "system" role, and passed instructions as the first user message
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a webscraper helper that extract data from HTML or text. You will be given piece of text or HTML content as input and also the prompt with the data you want to extract. The response should always be only the extracted data as a JSON array or object, without and additional words or explanation. Azalyze the input cafefully and extract data precisely bases on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output in always a valid JSON array without any surrounding text.\n\nContent:\n${content}\n\nPrompt:\n${prompt}`,
            },
          ],
        },
      ],
    });
    environment.log.info("Works fine");
    environment.log.info("Works fine");

    const response = result.response.text();
    if (!response) {
      environment.log.error("empty response from AI");
      return false;
    }

    environment.setOutput("Extracted data", response);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
