# Working with URSANODE

*These instructions presumes you have successfully [installed and initialized](1-install.md) the development environment!*

## 1. Running URSANODE Demos

URSANODE is a monorepo, which is a collection of multiple code examples in a single Git repository. This monorepo is managed with `lerna`, and uses several `lerna` commands as part of the npm scripts defined in `package.json`. 

#### Initializing the Repo

Several example packages depend on other packages in the repo. You will need to initialize the monorepo's Javascript dependencies for any examples to work using the provided **bootstrap** script as follows:
```
cd ~/dev/ursanode   # note: substitute with the location of your clone of ursanode
npm run bootstrap   # run the 'bootstrap' script defined in ~/dev/ursanode/package.json
```

#### Running the Built-In Demos

After you have initialized, you can run whatever demos might exist with the provided **start** script:
```
npm start           # run the 'start' script defined in ~/dev/ursanode/package.json
```
Use `CTRL-C` to stop the system.

TIP: For a complete list of scripts, look in `ursanode/package.json` under the `scripts` property.

## 2. Update URSANODE to latest code

When you want to update your local copy of the URSANODE repo, you will have to pull the latest code changes from our source code repository using Git. 
```
cd ~/dev/ursanode   # note: substitute with the location of your clone of ursanode
git pull            # grabs the latest from the upstream repository
npm run bootstrap   # re-initialize all the monorepo packages

```
## 3. Undoing Changes

If you have accidentally edited any files, use the command `git reset --hard HEAD` to restore the current branch to the way it was. You will lose all your changes (but that is what you wanted).

## A. References

* NPM Cheat Sheet
* Lerna Cheat Sheet
* Git Cheat Sheet
