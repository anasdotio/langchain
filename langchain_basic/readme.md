# LangChain Basic

This project is a small command-line chatbot built with [LangChain](https://www.langchain.com/) and Google Gemini.

## What is LangChain?

LangChain is a framework for building applications powered by large language models (LLMs). It provides a consistent interface for working with different model providers and useful building blocks for prompts, messages, tools, memory, retrieval, and multi-step workflows.

In this example, LangChain's `ChatGoogleGenerativeAI` class connects the application to a Gemini model.

## What is an agent?

An agent is an application that lets a language model decide what to do next in order to complete a task. Unlike a simple model call, an agent can use tools, inspect their results, and continue the conversation until it has enough information to answer.

An agent is made up of two closely related parts:

- **Model**: the language model that reasons about the user's request.
- **Harness**: the runtime around the model that supplies the system prompt and tools, runs the model/tool loop, manages state, and exposes the result or stream to the application.

The harness controls how the agent operates without requiring the application to implement the loop itself.

## `createAgent`

`createAgent` is LangChain's helper for creating an agent with a model, optional tools, and a system prompt. It returns an agent that can be invoked once or streamed over time.

```js
import { createAgent } from "langchain";

const agent = createAgent({
  model: llm,
  systemPrompt: "You are a helpful assistant.",
  tools: [],
});

const result = await agent.invoke({
  messages: [{ role: "user", content: "What is LangChain?" }],
});

console.log(result.messages.at(-1).content);
```

When tools are provided, the agent's harness manages the tool-calling loop:

```js
const agent = createAgent({
  model: llm,
  systemPrompt: "Use tools when they can help answer the user.",
  tools: [webSearch],
});
```

## `invoke`

`invoke` sends a request to a model and waits for the complete response before returning it. Use it when the application should process the answer as one result.

```js
const response = await llm.invoke([
  { role: "user", content: "What is LangChain?" },
]);

console.log(response.content);
```

The returned message contains the model's complete answer.

## `stream`

`stream` starts a request and returns an asynchronous stream of response chunks as the model generates them. This lets an application display the answer progressively instead of waiting for the entire response.

```js
const responseStream = await llm.stream([
  { role: "user", content: "Explain LangChain briefly." },
]);

for await (const chunk of responseStream) {
  process.stdout.write(chunk.content.toString());
}
```

The `index.js` example uses `stream` to print Gemini's response in real time. Type a question at the prompt, and type `exit` to quit.

## `streamMode`

When streaming an agent, `streamMode` determines which events the harness sends to the application:

- **`"messages"`**: streams model message chunks as they are generated. This is useful for displaying the agent's answer token by token.
- **`"updates"`**: streams state updates after each agent step, such as a model response or a tool result.
- **`"custom"`**: streams custom data emitted by application code or tools.

For example, the agent example uses `"messages"` to print only the generated text:

```js
const stream = await agent.stream(
  {
    messages: [{ role: "user", content: "Find the latest LangChain release." }],
  },
  { streamMode: "messages" },
);

for await (const [message] of stream) {
  if (message.type === "ai" && typeof message.content === "string") {
    process.stdout.write(message.content);
  }
}
```

Use `"messages"` for a live chat interface, `"updates"` when the UI should show agent progress and tool activity, and `"custom"` when tools need to report their own progress.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env` file in this directory and add your Google AI API key:

   ```env
   GOOGLE_API_KEY=your_google_api_key
   ```

3. Start the chatbot:

   ```bash
   node index.js
   ```

Keep `.env` private and do not commit your API key to source control.
