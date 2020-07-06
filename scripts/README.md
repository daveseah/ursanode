# Install Helper Script

This is a bash script that attempts to tell you what **development tools to install** by examining your operating system. I'm not an expert shell programmer so the techniques I'm using here are probably not the best, and I have not broadly tested them. Any help here is welcome!

## Approach

The script first makes sure that it's running at the top level of the repo.

The script then attempts to check, through unix utilities typically available in a MacOS/Linux shell environment, whether all necessary command line tools are available.

When the tool is **not installed**, two string buffers are added to:
* `OUT` gets a string like `[ ] tool not installed`
* `CLI` gets a string that are the commands to run to install the tool

When the tool is **already installed**, only the OUT buffer gets a string:
* `OUT` gets a string like `[X] tool is installed`

At the end of the detection phase, both OUT and CLI buffers are echoed to the string. The user can then copy/paste the CLI strings and run them manually.

## Environment Checks

1. Supported Environment? - is it Linux, Mac, Cygwin, MinGw, or unknown? We only support Mac currently.
2. XCode installed? - This installs Git and (maybe?) other tools that are necessary for installing Node packages requiring compilation (e.g. Node gyp)
3. Supported Shell? - MacOS pre-Catalina has `bash` as the default shell, while MacOS Catalina (and beyond?) use `zsh`
4. NVM already installed? - Node Version Manager is our preferred tool for installing NodeJS
5. Lerna installed globally? - Lerna is required for working with our monorepo

## Example Output

[![asciicast](https://asciinema.org/a/bsNtYXRjx15M7dp8wmsnwywlY.svg?autoplay=1)](https://asciinema.org/a/bsNtYXRjx15M7dp8wmsnwywlY?autoplay=1)
(Recorded with asciinema)
