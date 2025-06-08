#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "local-mcp-test",
  version: "0.1.0",
});

server.tool(
  "double_number",
  "与えられた数値を2倍にする",
  {num: z.number().describe("数値")},
  ({num}) => ({content: [{type: "text", text: (num * 2).toString()}]}),
);

server.tool(
  "pick_random_string",
  "文字列の配列からランダムに1つ選ぶ",
  {
    items: z.array(z.string()).describe("文字列の配列"),
  },
  ({ items }) => {
    const choice = items[Math.floor(Math.random() * items.length)];
    return { content: [{ type: "text", text: choice }] };
  },
);

server.tool(
  "shuffle_and_group_strings",
  "文字列の配列をシャッフルして指定された数のグループに分ける",
  {
    items: z.array(z.string()).describe("文字列の配列"),
    groupCount: z.number().min(1).describe("グループ数"),
  },
  ({ items, groupCount }) => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const groups: string[][] = Array.from({ length: groupCount }, () => []);
    shuffled.forEach((item, i) => {
      groups[i % groupCount].push(item);
    });
    return {
      content: groups.map((group, index) => ({
        type: "text",
        text: `Group ${index + 1}: ${group.join(", ")}`,
      })),
    };
  },
);


async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Example MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
