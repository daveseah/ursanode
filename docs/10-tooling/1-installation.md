# Dev Environment Setup

URSANODE is a collection of server and client code packages developed in Javascript. The system is implemented using NodeJS for the servers and HTML5 running in the browser. If you are familiar with Javascript development using a command line interface, then you will find these tools familiar. If not, we've tried to make the installation process as simple as possible.

## 0. Installing the Development Environment

If you are installing on a clean MacOS Mojave or later system:

1. open **Terminal** app
2. enter `xcode-select --install` (accept dialog box, then wait for install to complete)
3. enter `cd ~; mkdir dev` (creates a 'dev' directory in your user folder)

Now download the repo:

1. enter `cd ~/dev`
2. enter `git clone https://github.com/daveseah/ursanode`
3. enter `cd gsgo`

Next we need to ensure that several command line tools are installed. There's a script in `scripts/install-helper.sh` that you can run that will attempt to detect what you need to install: 

1. enter `./scripts/install-helper.sh`
2. read the output to see what to do!

## 1. (Optional) Install Recommended Code Editor

URSANODE is being developed using [Visual Studio Code](https://code.visualstudio.com/Download) (VSCode). I've included a workspace named `ursanode.code-workspace` that has several project-specific settings in it. There is also a `.vscode` directory that has my settings, code template, and recommended extensions. 

For more information about what these extensions are doing, see [`20-tooling/20-vscode-qol.md`](20-vscode-qol.md). 

## **NEXT:** [RUNNING URSANODE](20-dev-running.md)



