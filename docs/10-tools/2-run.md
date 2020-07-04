# Working with URSANODE

*These instructions presumes you have successfully [installed and initialized](1-install.md) the development environment!*

## 1. Running URSANODE Demos

URSANOODE is a monorepo, which is a collection of multiple code examples in a single Git repository. Before you can run any example code, you need to initialize the repo's Javascript dependencies. I've provided several scripts to make this easier.

First initialize the repo with the **bootstrap** script:
```
cd ~/dev/ursanode
npm run bootstrap
``` 
Then you can run whatever demo might exist for the overall system by using the **start** script:
```
npm start
```
Use `CTRL-C` to stop system.

For a complete list of scripts, look in `ursanode/package.json` under the `scripts` property.

## 2. Update URSANODE to latest code

To make sure your version of URSANODE is up to date, you will have to pull the latest code changes from our source code repository. Again from the command line in the `ursanode` directory:
```
git pull
npm run bootstrap
```
## TIPS

* If you have accidentally edited any files, use the command `git reset --hard HEAD` to restore the current branch to the way it was. You will lose all your changes.


