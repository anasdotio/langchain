import "dotenv/config";
import { createAgent } from "langchain";
import readline from "node:readline/promises";
import { stdout as output, stdin as input } from "node:process";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { webSearch } from "./tools/index.js";

const rl = readline.createInterface({ input, output });

console.log("Chat agent. Type 'exit' to quit.");

const agent = createAgent({
  model: new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite",
    streaming: true,
  }),
  systemPrompt: `
  You are a helpful assistant. Answer the user's questions as best as you can.
If the user asks for information that you don't have, use the webSearch tool to find it.
  `,
  tools: [webSearch],
});

while (true) {
  const userInput = await rl.question("You: ");
  if (userInput.toLowerCase() === "exit") {
    console.log("Exiting...");
    break;
  }

  const result = await agent.stream(
    {
      messages: [{ role: "human", content: userInput }],
    },
    { streamMode: "messages" },
  );

  process.stdout.write("Agent: ");

  for await (const [message] of result) {
    if (message.type !== "ai" || typeof message.content !== "string") continue;

    process.stdout.write(message.content);
  }

  console.log("\n");
}

rl.close();
