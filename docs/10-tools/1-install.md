# Dev Environment Setup

URSANODE is a collection of server and client code packages developed in Javascript. The system is implemented using NodeJS for the servers and HTML5 running in the browser. 

These instructions are tested and confirmed on **MacOS 10.14 Mojave**.

## 1. Downloading the Repo

If you **don't** already have a directory for your javascript projects, create one named `dev` in your user folder:

1. open **Terminal** app
2. enter `cd ~; mkdir dev` (creates a 'dev' directory in your user folder)
3. enter `cd ~/dev`

> ***NOTE*** 
If this is the **first time** you're doing any development on your Mac, you'll also need to install the basic development tools:
**MacOS**: enter `xcode-select --install` (accept dialog box, then wait for install to complete)
**Debian/Ubuntu**: `sudo apt-get update && sudo apt-get install build-essential`
**RHEL/CentOS 8**: `dnf groupinstall "Development Tools"` (replace `dnf` with `yum` for older distros).

Now download the repo from Github:

4. Make sure you're in the `~/dev` directory!
5. enter `git clone https://github.com/daveseah/ursanode`
6. enter `cd ursanode`

## 2. Installing URSANODE Dependencies

Next we need to ensure that several command line tools are installed. There's a script in `scripts/install-helper.sh` that you can run that will do its best to print a list of commands you need to run.

7. enter `./scripts/install-helper.sh`
8. read the output to see what to do!

## 3. (Optional) Install Recommended Code Editor

URSANODE is being developed using [Visual Studio Code](https://code.visualstudio.com/Download) (VSCode) as my programming editor. It's great, and I've included a project workspace named `ursanode.code-workspace` with project-specific helpers in it that are automatically loaded from the `.vscode` directory for you. For more details about what these extensions are doing, see [`3-vscode.md`](3-vscode.md). 

---
### NEXT STEPS
Now that the dependencies and development environment are set up, here's how to [RUN URSANODE](2-run.md).



