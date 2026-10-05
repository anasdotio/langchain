import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
/**
 * This example shows how to use the Google Gemini API with LangChain to ask a question and get an answer from the model.
 */
import readline from "node:readline/promises";

// Import the stdin and stdout streams from the process module
import { stdin as input, stdout as output } from "process";

// Create a readline interface to read user input from the command line
const rl = readline.createInterface({ input, output });

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  streaming: true,
});

while (true) {
  const question = await rl.question("Ask a question: ");

  if (question.toLowerCase() === "exit") {
    console.log("Exiting...");
    break;
  }
  const aiMsg = await llm.stream([
    {
      role: "system",
      content:
        "You are a helpful assistant. Please answer the following question. ",
    },
    {
      role: "user",
      content: question,
    },
  ]);

  for await (const part of aiMsg) {
    process.stdout.write(part.content.toString());
    process.stdout.write("\n");
  }
}
