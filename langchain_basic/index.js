import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
/**
 * This example shows how to use the Google Gemini API with LangChain to ask a question and get an answer from the model.
 */
import readline from "node:readline/promises";

import { stdin as input, stdout as output } from "process";

const rl = readline.createInterface({ input, output });

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
});

const question = await rl.question("Ask a question: ");

const aiMsg = await llm.invoke([
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

console.log(aiMsg.content);

rl.close();
