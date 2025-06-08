# Local MCP Test

## このリポジトリについて

ローカル環境でMCPサーバーを構築する検証のためのリポジトリ

## 初期設定

### Claude Desktop

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`  
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json:claude_desktop_config.json
{
  "mcpServers": {
    "local-mcp-test": {
      "command": "npx",
      "args": ["github:cti1650/local-mcp-test"]
    }
  }
}
```

## 参考サイト

- [簡易な自作MCPサーバーをお試しで実装する方法](https://zenn.dev/smartround_dev/articles/02af1058e9f80f)