import { Args, Command, Flags } from '@oclif/core'
import * as fs from 'fs'
import * as path from 'path'
import inquirer from 'inquirer'
import * as jose from 'jose'
import axios from 'axios'

interface TinybirdConfig {
  token: string
  tinybird_api: string
}

interface TokenClaims {
  host?: string
  [key: string]: any
}

export default class Auth extends Command {
  static description = 'Authenticate with your Tinybird workspace'

  static examples = [
    '<%= config.bin %> auth',
    '<%= config.bin %> auth --token your-token',
    '<%= config.bin %> auth --dir /path/to/project',
  ]

  static flags = {
    token: Flags.string({
      char: 't',
      description: 'Tinybird API token',
      required: false,
    }),
    dir: Flags.string({
      char: 'd',
      description: 'Path to Tinybird project directory',
      required: false,
    }),
  }

  // Map of host values to API URLs (placeholder for now)
  private apiUrlMap: Record<string, string> = {
    'eu_shared': 'https://api.tinybird.co',
    'us_east': 'https://api.us-east.tinybird.co',
    'us-east-aws': 'https://api.us-east.aws.tinybird.co',
    'aws-us-west-2': 'https://api.us-west-2.aws.tinybird.co',
    'aws-eu-central-1': 'https://api.eu-central-1.aws.tinybird.co',
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

  private async validateToken(token: string): Promise<boolean> {
    try {
      // Parse token to get host
      const decoded = jose.decodeJwt(token) as TokenClaims
      const host = decoded?.host || 'api.tinybird.co' // default to main API if no host claim

      // Get API URL from map
      const apiUrl = this.apiUrlMap[host] || 'https://api.tinybird.co'

      // Make validation request
      const response = await axios.post(
        `${apiUrl}/v0/datasources`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status !== 200) {
        return false
      }
      if (('datasources' in response.data) || ('datasource' in response.data)) {
        return true
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        return false
      }
      throw error
    }
  }

  private async promptForToken(): Promise<string> {
    const { token } = await inquirer.prompt({
      type: 'password',
      name: 'token',
      message: 'Enter your Tinybird API token:',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Token cannot be empty'
        }
        return true
      },
    })
    return token
  }

  private getApiUrlFromToken(token: string): string {
    const decoded = jose.decodeJwt(token) as TokenClaims
    const host = decoded?.host || 'api.tinybird.co'
    return this.apiUrlMap[host] || 'https://api.tinybird.co'
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Auth)

    // Find tinybird directory
    let tinybirdDir: string | null
    if (flags.dir) {
      const dirPath = path.resolve(flags.dir)
      if (!fs.existsSync(dirPath)) {
        this.error(`Directory not found: ${dirPath}`)
        return
      }

      if (path.basename(dirPath) === 'tinybird' && fs.existsSync(dirPath)) {
        tinybirdDir = dirPath
      } else {
        tinybirdDir = this.findTinybirdDir(dirPath)
      }
    } else {
      tinybirdDir = this.findTinybirdDir(process.cwd())
    }

    if (!tinybirdDir) {
      this.error('No tinybird directory found. Run `init` first to create a new project or specify the correct directory with --dir.')
      return
    }

    // Get token either from flag or prompt
    const token = flags.token || await this.promptForToken()

    // Validate token
    this.log('Validating token...')
    try {
      const isValid = await this.validateToken(token)
      if (!isValid) {
        this.error('Invalid token. Please check your token and try again.')
        return
      }
    } catch (error) {
      this.error('Failed to validate token: ' + (error as Error).message)
      return
    }

    // Get API URL from token
    const apiUrl = this.getApiUrlFromToken(token)

    // Create config
    const config: TinybirdConfig = {
      token,
      tinybird_api: apiUrl,
    }

    // Write config file
    const configPath = path.join(tinybirdDir, '.tinybird')
    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
      this.log('✨ Successfully authenticated with Tinybird!')
    } catch (error) {
      this.error('Failed to save configuration: ' + (error as Error).message)
    }
  }
}
