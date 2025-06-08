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
  "文字列の配列をシャッフルして指定された数のグループに分ける（グループ数 or 1グループの最大人数のどちらかを指定）",
  {
    items: z.array(z.string()).describe("文字列の配列"),
    groupCount: z.number().min(1).optional().describe("グループ数（指定する場合）"),
    maxPerGroup: z.number().min(1).optional().describe("1グループの最大人数（指定する場合）"),
  },
  ({ items, groupCount, maxPerGroup }) => {
    if ((groupCount && maxPerGroup) || (!groupCount && !maxPerGroup)) {
      throw new Error("グループ数か1グループの最大人数のどちらか1つだけを指定してください");
    }

    const shuffled = [...items].sort(() => Math.random() - 0.5);
    let groups: string[][];

    if (groupCount) {
      groups = Array.from({ length: groupCount }, () => []);
      shuffled.forEach((item, i) => {
        groups[i % groupCount].push(item);
      });
    } else if (maxPerGroup) {
      const groupCountCalculated = Math.ceil(shuffled.length / maxPerGroup);
      groups = Array.from({ length: groupCountCalculated }, () => []);
      shuffled.forEach((item, i) => {
        groups[i % groupCountCalculated].push(item);
      });
    } else {
      groups = [];
    }

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
