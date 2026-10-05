import { tavily } from "@tavily/core";
import { tool } from "langchain";
import * as z from "zod";

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});
export const webSearch = tool(
  async (query) => {
    console.log("Searching the web for:", query);
    const data = await tvly.webSearch(query);
    console.log("Web search results:", data.results);
    return JSON.stringify(data.results ?? []);
  },
  {
    name: "webSearch",
    description: "Search the web for information",
    inputSchema: z.object({
      query: z.string().describe("The search query"),
    }),
  },
);
