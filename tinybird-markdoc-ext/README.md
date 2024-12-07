# Tinybird Markdoc Extension

A specialized Markdoc parser for Tinybird files that adds support for custom nodes like queries and tables.

## Installation

```bash
npm install @sdairs/tinybird-markdoc-ext
```

## Usage

```typescript
import { TinybirdParser } from '@sdairs/tinybird-markdoc-ext'

// Create a parser instance
const parser = new TinybirdParser()

// Parse a file
const content = `
---
type: query
name: my_query
---

This is a query that selects data.

{% query name="my_query" %}
SELECT * FROM my_table
{% /query %}
`

// Get both frontmatter and content
const { frontmatter, content } = parser.parseFile(content)

// Or just render to HTML
const html = parser.renderHtml(content)
```

## Custom Nodes

### Query Node

The query node allows you to define SQL queries in your Tinybird files:

```markdown
{% query name="my_query" %}
SELECT * FROM my_table
{% /query %}
```

### Table Node

The table node allows you to define table schemas:

```markdown
{% datasource name="my_table" delimiter="|" %}
id|UUID|$.id|User ID
name|String|$.name|Person's full name
age|UInt8|$.age|Person's age
{% /datasource %}
```

## Extending

You can add your own custom nodes when creating a parser instance:

```typescript
const parser = new TinybirdParser({
  nodes: {
    myCustomNode: {
      render: 'CustomNode',
      attributes: {
        name: { type: String, required: true }
      },
      transform(node, config) {
        // Custom transform logic
      }
    }
  }
})
```

## API

### `TinybirdParser`

The main parser class with the following methods:

- `parse(content: string)`: Parse content and return AST
- `transform(ast: any)`: Transform AST into renderable tree
- `renderHtml(content: string)`: Render content to HTML
- `getFrontmatter(content: string)`: Get just the frontmatter
- `parseFile(content: string)`: Get both frontmatter and content

### Default Export

The package also exports a default instance with standard configuration:

```typescript
import tinybirdParser from '@tinylabs/tinybird-file-parser'

const html = tinybirdParser.renderHtml(content)
```
