import {Command, Flags} from '@oclif/core'
import * as fs from 'fs'
import * as path from 'path'

export default class Init extends Command {
  static description = 'Initialize a new Tinybird project structure'

  static examples = [
    '<%= config.bin %> init',
    '<%= config.bin %> init --dir my-project',
  ]

  static flags = {
    dir: Flags.string({
      char: 'd',
      description: 'Parent directory for the tinybird project',
      default: '.',
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Init)
    
    // Create base directory with 'tinybird' as the project folder
    const baseDir = path.resolve(process.cwd(), flags.dir, 'tinybird')
    
    // Define project structure
    const directories = [
      'connections',
      'queries',
      'secrets',
      'tables',
      'variables',
    ]

    try {
      // Create base tinybird directory if it doesn't exist
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, {recursive: true})
        this.log(`Created tinybird directory: ${baseDir}`)
      }

      // Create subdirectories
      for (const dir of directories) {
        const dirPath = path.join(baseDir, dir)
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath)
          this.log(`Created directory: tinybird/${dir}`)
        }
      }

      // Create a .gitkeep file in each directory to ensure they're tracked by git
      for (const dir of directories) {
        const gitkeepPath = path.join(baseDir, dir, '.gitkeep')
        if (!fs.existsSync(gitkeepPath)) {
          fs.writeFileSync(gitkeepPath, '')
        }
      }

      this.log('\n✨ Tinybird project structure initialized successfully!')
    } catch (error) {
      this.error('Failed to create project structure: ' + (error as Error).message)
    }
  }
}
