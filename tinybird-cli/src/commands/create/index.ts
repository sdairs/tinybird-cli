import { Args, Command, Flags } from '@oclif/core'
import * as fs from 'fs'
import * as path from 'path'

type ResourceType = 'table' | 'query' | 'connection' | 'secret' | 'variable'

export default class Create extends Command {
  static description = 'Create a new Tinybird resource file'

  static examples = [
    '<%= config.bin %> create table my_table',
    '<%= config.bin %> create query my_query',
    '<%= config.bin %> create connection my_kafka',
    '<%= config.bin %> create secret my_secret',
    '<%= config.bin %> create variable my_var',
    '<%= config.bin %> create table my_table --dir /path/to/project',
  ]

  static args = {
    type: Args.string({
      description: 'Type of resource to create',
      required: true,
      options: ['table', 'query', 'connection', 'secret', 'variable'],
    }),
    name: Args.string({
      description: 'Name of the resource',
      required: true,
    }),
  }

  static flags = {
    dir: Flags.string({
      char: 'd',
      description: 'Path to Tinybird project directory',
      required: false,
    }),
  }

  private getTemplateContent(type: ResourceType, name: string): string {
    const templates: Record<ResourceType, string> = {
      table: `---
type: table
name: ${name}
---

{% datasource name="${name}" delimiter="|" %}
column|type|expression|description
{% /datasource %}
`,
      query: `---
type: query
name: ${name}
---

{% query name="${name}" %}
SELECT * FROM table_name
{% /query %}
`,
      connection: `---
type: connection
name: ${name}
---
{% connection name="${name}" %}
type: kafka
host: localhost
port: 9092
{% /connection %}
`,
      secret: `---
type: secret
name: ${name}
---
{% secret name="${name}" %}
key: value
{% /secret %}
`,
      variable: `---
type: variable
name: ${name}
---
{% variable name="${name}" %}
key: value
{% /variable %}
`,
    }

    return templates[type]
  }

  private getResourceDir(type: ResourceType): string {
    const dirMap: Record<ResourceType, string> = {
      table: 'tables',
      query: 'queries',
      connection: 'connections',
      secret: 'secrets',
      variable: 'variables',
    }
    return dirMap[type]
  }

  private findTinybirdDir(startDir: string): string | null {
    let currentDir = startDir

    while (currentDir !== path.parse(currentDir).root) {
      const possibleTinybirdDir = path.join(currentDir, 'tinybird')
      if (fs.existsSync(possibleTinybirdDir)) {
        return possibleTinybirdDir
      }
      currentDir = path.dirname(currentDir)
    }

    return null
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Create)
    const type = args.type as ResourceType
    const name = args.name

    let tinybirdDir: string | null

    if (flags.dir) {
      // If --dir is specified, look for tinybird directory in that location
      const dirPath = path.resolve(flags.dir)
      if (!fs.existsSync(dirPath)) {
        this.error(`Directory not found: ${dirPath}`)
        return
      }

      // Check if the specified directory is the tinybird directory itself
      if (path.basename(dirPath) === 'tinybird' && fs.existsSync(dirPath)) {
        tinybirdDir = dirPath
      } else {
        // Look for a tinybird directory inside the specified directory
        tinybirdDir = this.findTinybirdDir(dirPath)
      }
    } else {
      // If no --dir specified, look for tinybird directory from current directory up
      tinybirdDir = this.findTinybirdDir(process.cwd())
    }

    if (!tinybirdDir) {
      this.error('No tinybird directory found. Run `init` first to create a new project or specify the correct directory with --dir.')
      return
    }

    const resourceDir = this.getResourceDir(type)
    const targetDir = path.join(tinybirdDir, resourceDir)
    const fileName = `${name}.tinybird`
    const filePath = path.join(targetDir, fileName)

    // Check if directory exists
    if (!fs.existsSync(targetDir)) {
      this.error(`Resource directory ${resourceDir} not found. Run \`init\` first to create project structure.`)
      return
    }

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      this.error(`File ${fileName} already exists in ${resourceDir} directory.`)
      return
    }

    try {
      // Create the file with template content
      fs.writeFileSync(filePath, this.getTemplateContent(type, name))
      this.log(`Created ${type} resource: ${filePath}`)
    } catch (error) {
      this.error(`Failed to create resource: ${(error as Error).message}`)
    }
  }
}
