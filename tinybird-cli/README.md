@sdairs/tinybird-cli
=================

Experimental CLI for Tinybird


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tinybird-cli.svg)](https://npmjs.org/package/tinybird-cli)
[![Downloads/week](https://img.shields.io/npm/dw/tinybird-cli.svg)](https://npmjs.org/package/tinybird-cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @sdairs/tinybird-cli
$ tinybird-cli COMMAND
running command...
$ tinybird-cli (--version)
@sdairs/tinybird-cli/0.1.1 darwin-arm64 node-v22.11.0
$ tinybird-cli --help [COMMAND]
USAGE
  $ tinybird-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`tinybird-cli auth`](#tinybird-cli-auth)
* [`tinybird-cli create TYPE NAME`](#tinybird-cli-create-type-name)
* [`tinybird-cli docs`](#tinybird-cli-docs)
* [`tinybird-cli help [COMMAND]`](#tinybird-cli-help-command)
* [`tinybird-cli init`](#tinybird-cli-init)
* [`tinybird-cli plugins`](#tinybird-cli-plugins)
* [`tinybird-cli plugins:add PLUGIN`](#tinybird-cli-pluginsadd-plugin)
* [`tinybird-cli plugins:inspect PLUGIN...`](#tinybird-cli-pluginsinspect-plugin)
* [`tinybird-cli plugins:install PLUGIN`](#tinybird-cli-pluginsinstall-plugin)
* [`tinybird-cli plugins:link PATH`](#tinybird-cli-pluginslink-path)
* [`tinybird-cli plugins:remove [PLUGIN]`](#tinybird-cli-pluginsremove-plugin)
* [`tinybird-cli plugins:reset`](#tinybird-cli-pluginsreset)
* [`tinybird-cli plugins:uninstall [PLUGIN]`](#tinybird-cli-pluginsuninstall-plugin)
* [`tinybird-cli plugins:unlink [PLUGIN]`](#tinybird-cli-pluginsunlink-plugin)
* [`tinybird-cli plugins:update`](#tinybird-cli-pluginsupdate)

## `tinybird-cli auth`

Authenticate with your Tinybird workspace

```
USAGE
  $ tinybird-cli auth [-t <value>] [-d <value>]

FLAGS
  -d, --dir=<value>    Path to Tinybird project directory
  -t, --token=<value>  Tinybird API token

DESCRIPTION
  Authenticate with your Tinybird workspace

EXAMPLES
  $ tinybird-cli auth

  $ tinybird-cli auth --token your-token

  $ tinybird-cli auth --dir /path/to/project
```

_See code: [src/commands/auth/index.ts](https://github.com/sdairs/tinybird-cli/blob/v0.1.1/src/commands/auth/index.ts)_

## `tinybird-cli create TYPE NAME`

Create a new Tinybird resource file

```
USAGE
  $ tinybird-cli create TYPE NAME [-d <value>]

ARGUMENTS
  TYPE  (table|query|connection|secret|variable) Type of resource to create
  NAME  Name of the resource

FLAGS
  -d, --dir=<value>  Path to Tinybird project directory

DESCRIPTION
  Create a new Tinybird resource file

EXAMPLES
  $ tinybird-cli create table my_table

  $ tinybird-cli create query my_query

  $ tinybird-cli create connection my_kafka

  $ tinybird-cli create secret my_secret

  $ tinybird-cli create variable my_var

  $ tinybird-cli create table my_table --dir /path/to/project
```

_See code: [src/commands/create/index.ts](https://github.com/sdairs/tinybird-cli/blob/v0.1.1/src/commands/create/index.ts)_

## `tinybird-cli docs`

Generate and serve documentation from .tinybird files

```
USAGE
  $ tinybird-cli docs [-d <value>]

FLAGS
  -d, --dir=<value>  [default: ./tinybird] Path to the tinybird directory

DESCRIPTION
  Generate and serve documentation from .tinybird files

EXAMPLES
  $ tinybird-cli docs

  $ tinybird-cli docs --dir /path/to/tinybird
```

_See code: [src/commands/docs/index.ts](https://github.com/sdairs/tinybird-cli/blob/v0.1.1/src/commands/docs/index.ts)_

## `tinybird-cli help [COMMAND]`

Display help for tinybird-cli.

```
USAGE
  $ tinybird-cli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for tinybird-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.18/src/commands/help.ts)_

## `tinybird-cli init`

Initialize a new Tinybird project structure

```
USAGE
  $ tinybird-cli init [-d <value>]

FLAGS
  -d, --dir=<value>  [default: .] Parent directory for the tinybird project

DESCRIPTION
  Initialize a new Tinybird project structure

EXAMPLES
  $ tinybird-cli init

  $ tinybird-cli init --dir my-project
```

_See code: [src/commands/init/index.ts](https://github.com/sdairs/tinybird-cli/blob/v0.1.1/src/commands/init/index.ts)_

## `tinybird-cli plugins`

List installed plugins.

```
USAGE
  $ tinybird-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ tinybird-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.21/src/commands/plugins/index.ts)_

## `tinybird-cli plugins:add PLUGIN`

Installs a plugin into tinybird-cli.

```
USAGE
  $ tinybird-cli plugins:add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into tinybird-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the TINYBIRD_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the TINYBIRD_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ tinybird-cli plugins:add

EXAMPLES
  Install a plugin from npm registry.

    $ tinybird-cli plugins:add myplugin

  Install a plugin from a github url.

    $ tinybird-cli plugins:add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ tinybird-cli plugins:add someuser/someplugin
```

## `tinybird-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ tinybird-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ tinybird-cli plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.21/src/commands/plugins/inspect.ts)_

## `tinybird-cli plugins:install PLUGIN`

Installs a plugin into tinybird-cli.

```
USAGE
  $ tinybird-cli plugins:install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into tinybird-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the TINYBIRD_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the TINYBIRD_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ tinybird-cli plugins:add

EXAMPLES
  Install a plugin from npm registry.

    $ tinybird-cli plugins:install myplugin

  Install a plugin from a github url.

    $ tinybird-cli plugins:install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ tinybird-cli plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.21/src/commands/plugins/install.ts)_

## `tinybird-cli plugins:link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ tinybird-cli plugins:link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ tinybird-cli plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.21/src/commands/plugins/link.ts)_

## `tinybird-cli plugins:remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ tinybird-cli plugins:remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ tinybird-cli plugins:unlink
  $ tinybird-cli plugins:remove

EXAMPLES
  $ tinybird-cli plugins:remove myplugin
```

## `tinybird-cli plugins:reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ tinybird-cli plugins:reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.21/src/commands/plugins/reset.ts)_

## `tinybird-cli plugins:uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ tinybird-cli plugins:uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ tinybird-cli plugins:unlink
  $ tinybird-cli plugins:remove

EXAMPLES
  $ tinybird-cli plugins:uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.21/src/commands/plugins/uninstall.ts)_

## `tinybird-cli plugins:unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ tinybird-cli plugins:unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ tinybird-cli plugins:unlink
  $ tinybird-cli plugins:remove

EXAMPLES
  $ tinybird-cli plugins:unlink myplugin
```

## `tinybird-cli plugins:update`

Update installed plugins.

```
USAGE
  $ tinybird-cli plugins:update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.21/src/commands/plugins/update.ts)_
<!-- commandsstop -->
