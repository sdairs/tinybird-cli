import {Command, Flags} from '@oclif/core'
import express from 'express'
import * as path from 'path'
import * as fs from 'fs'
import { TinybirdParser } from '@sdairs/tinybird-markdoc-ext'

export default class Docs extends Command {
  static description = 'Generate and serve documentation from .tinybird files'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --dir /path/to/tinybird',
  ]

  static flags = {
    dir: Flags.string({
      char: 'd',
      description: 'Path to the tinybird directory',
      required: false,
      default: './tinybird'
    })
  }

  private parser: TinybirdParser

  constructor(argv: string[], config: any) {
    super(argv, config)
    this.parser = new TinybirdParser()
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Docs)
    
    // Resolve the tinybird directory path
    const tinybirdDir = path.resolve(flags.dir)
    
    // Ensure tinybird directory exists
    if (!fs.existsSync(tinybirdDir)) {
      this.error(`Tinybird directory not found: ${tinybirdDir}`)
      return
    }

    // Create .tinybird-cli directory if it doesn't exist
    const cliDir = path.join(tinybirdDir, '.tinybird-cli')
    if (!fs.existsSync(cliDir)) {
      fs.mkdirSync(cliDir, { recursive: true })
    }

    // Set up docs directory within .tinybird-cli
    const docsDir = path.join(cliDir, 'docs')
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true })
    }

    // Generate static files
    await this.generateDocs(tinybirdDir, docsDir)

    // Start server
    const app = express()
    app.use(express.static(docsDir))
    
    const port = 3000
    app.listen(port, () => {
      this.log(`Documentation server running at http://localhost:${port}`)
      this.log(`Serving documentation for: ${tinybirdDir}`)
    })
  }

  private async generateDocs(sourceDir: string, outputDir: string) {
    const files = this.getTinybirdFiles(sourceDir)
    
    // Generate index page with sections
    const sections = new Map<string, Array<{
      path: string
      name: string
      type: string
      description?: string
    }>>()
    
    // Process each file
    for (const file of files) {
      const relativePath = path.relative(sourceDir, file)
      const content = fs.readFileSync(file, 'utf-8')
      
      // Parse the file
      const { frontmatter, content: tree } = this.parser.parseFile(content)
      const html = this.parser.renderHtml(content)
      
      // Add to sections
      const dir = path.dirname(relativePath)
      if (!sections.has(dir)) {
        sections.set(dir, [])
      }
      
      sections.get(dir)!.push({
        path: relativePath,
        name: frontmatter.name || path.basename(file, '.tinybird'),
        type: frontmatter.type || 'unknown',
        description: this.getFirstParagraph(content)
      })
      
      // Generate final HTML with layout
      const finalHtml = this.wrapWithLayout({
        title: frontmatter.name || path.basename(file, '.tinybird'),
        type: frontmatter.type,
        metadata: frontmatter,
        content: html
      })

      // Write to output file
      const outputPath = path.join(
        outputDir, 
        relativePath.replace('.tinybird', '.html')
      )
      
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
      fs.writeFileSync(outputPath, finalHtml)
    }

    // Generate index page
    const indexHtml = this.generateIndexPage(sections)
    fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml)
  }

  private getTinybirdFiles(dir: string): string[] {
    const files: string[] = []
    
    const items = fs.readdirSync(dir)
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        files.push(...this.getTinybirdFiles(fullPath))
      } else if (item.endsWith('.tinybird')) {
        files.push(fullPath)
      }
    }
    
    return files
  }

  private getFirstParagraph(content: string): string | undefined {
    const match = content.match(/^(?:.*\n)*?\n([^\n#].*?)(?:\n\n|\n?$)/m)
    return match ? match[1].trim() : undefined
  }

  private generateIndexPage(sections: Map<string, Array<{path: string; name: string; type: string; description?: string}>>): string {
    let content = '<div class="space-y-12">'
    
    for (const [section, files] of sections) {
      content += `
        <div>
          <h2 class="text-2xl font-semibold mb-6">${section === '.' ? 'Root' : section}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${files.map(file => `
              <a href="${file.path.replace('.tinybird', '.html')}" 
                 class="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-medium text-gray-900">${file.name}</h3>
                  <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    ${file.type}
                  </span>
                </div>
                ${file.description ? `
                  <p class="text-gray-600 text-sm line-clamp-2">${file.description}</p>
                ` : ''}
              </a>
            `).join('')}
          </div>
        </div>
      `
    }
    
    content += '</div>'

    return this.wrapWithLayout({
      title: 'Tinybird Documentation',
      content,
      metadata: {}
    })
  }

  private wrapWithLayout(data: { title: string; type?: string; content: string; metadata: any }) {
    const metadataHtml = Object.keys(data.metadata).length > 0 
      ? `<div class="bg-gray-100 p-4 rounded-lg mb-8">
          <h3 class="text-lg font-semibold mb-2">Metadata</h3>
          <dl class="grid grid-cols-2 gap-2">
            ${Object.entries(data.metadata).map(([key, value]) => `
              <dt class="font-medium text-gray-600">${key}</dt>
              <dd>${JSON.stringify(value, null, 2)}</dd>
            `).join('')}
          </dl>
        </div>`
      : ''

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${data.title} - Tinybird Docs</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism.min.css">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-sql.min.js"></script>
          <style>
            /* Add support for line-clamp */
            .line-clamp-2 {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          </style>
        </head>
        <body class="bg-gray-50">
          <div class="container mx-auto px-4 py-8 max-w-6xl">
            <nav class="mb-8 flex items-center space-x-4">
              <a href="/" class="text-blue-600 hover:text-blue-800">Home</a>
              ${data.type ? `
                <span class="text-gray-400">/</span>
                <span class="text-gray-600">${data.type}s</span>
              ` : ''}
              <span class="text-gray-400">/</span>
              <span class="text-gray-600">${data.title}</span>
            </nav>
            <main>
              <div class="flex items-center justify-between mb-8">
                <h1 class="text-4xl font-bold">${data.title}</h1>
                ${data.type ? `
                  <span class="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    ${data.type}
                  </span>
                ` : ''}
              </div>
              ${metadataHtml}
              <div class="prose max-w-none">
                ${data.content}
              </div>
            </main>
          </div>
        </body>
      </html>
    `
  }
}
