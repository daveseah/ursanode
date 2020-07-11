# About Monorepos

The URSANODE project files are organized as a **monorepo**, which is simply a single Git repository that hosts more than one project. Ordinarily a Git repo contains a single project, but this approach becomes cumbersome when you have multiple projects that are closely intertwined. With a monorepo, you can make changes across multiple projects and update them as an entire set in a single Git commit.

So how do monorepos work with Node Package Manager? The essential idea is that you have a single Git repo that has a subdirectory for each project. Each project has their library dependencies defined in their own `package.json`. NPM already knows how to load local dependencies that are located in other directories, so that is technically all you need to make your own monorepo.

In practice, though, there are tools to synchronize **versionining** and **package updating** of each individual project as one. The two popular ones are **Lerna** and **Yarn**, and all they do is update each project directory for you. 

In URSANODE, the tool we are using is Lernab with NPM because it is very slightly more mature, and we are also using `npm` instead of `yarn` as our package manager. 

## Minimum Lerna Config

A minimum Lerna monorepo consists of:

* a root `package.json` that lists `lerna` as a devDependency. 
* a `lerna.json` file with minimum `version` field in SemVer format.
* a `packages` directory that will contain the individual repos.

URSANODE adds configuration files to support the [recommended build environment](1-install.md):

* Configuration files for EditorConfig, ESLint, Git, Node Version Manager, Prettier, Typescript.
* Visual Studio Code workspace file and workspace settings.
* Required modules for the `ursarun` command line utility, as defined in `package.json`.

Additionally, URSANODE uses `@ursanode` as its [scoped package name](https://docs.npmjs.com/using-npm/scope.html). You can see this referred to in all the `package.json` files in the `ur_packages` directory.



---



# Monorepo Task Reference

Lerna doesn't have a lot of commands. I'll list common tasks that I am using with URSANODE. 

## Create a new monorepo with `lerna init`

Make sure you have `lerna` installed globally, using this command:
```
npm i -g lerna
```
Then you can create a new blank lerna repo in the directory of your choice:
```
cd /path/to/NEW/monorepo
lerna init
```
This will create the blank monorepo structure as a Git repository. Edit the  root `package.json` as needed to reflect your project needs. For URSANODE, I made sure that `private: true` was set because this is not (yet) a public package in the global [npm registry](https://www.npmjs.com/).

You will also want to `git commit` the new files. This is good time to set various Git-related settings and establish an upstream repo in GitHub or your remote repository of choice.

You may also want to adjust the starting version number and package directory in `lerna.json`. I started URSANODE with version `0.0.0` until the first "release" is fleshed-out. Lerna has a command for incrementing versions that is discussed below. 



## Add a project with `lerna create`

To create new projects in the monorepo, issue the following commands:
```
cd /path/to/monorepo          # make sure you are in the mono repo otherwise will get an error
lerna create mypackage -y     # create npm package skeleton using YES to all defaults
```
This will create a new directory `mypackage` in the projects directory named `packages` (unless you have changed it in `lerna.json`). 

If you want to import a project into another project within your monorepo, use **scoped project names**. 
For example, use `@myscope/mypackage` instead of `mypackage`.

You should look at the `package.json` and update it as necessary because they probably aren't what you want. This is an example of the default output using `lerna create @myscope/mypackage -y`:
```
{
  "name": "@myscope/mypackage",
  "version": "0.0.0",
  "description": "Now I’m the model of a modern major general / [...]",
  "keywords": [],
  "author": "Dave 'Sri' Seah <david@davidseah.com>",
  "license": "ISC",
  "main": "lib/mypackage.js",
  "directories": {
    "lib": "lib",
    "test": "__tests__"
  },
  "files": [
    "lib"
  ],
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "test": "echo \"Error: run tests from root\" && exit 1"
  }
}
```
At minimum you'll want to change **description**. For URSANODE I also remove the `__tests__` and `lib` folders, then edit `package.json` as follows:

* change `"license": "MIT"`
* add `"private": true`
* remove `publishConfig`
* remove `main` unless this will be a library package with an entry point
* empty `"scripts": {}`
* remove `dependencies`, `devDependencies`, and `files`

This gives me a blank starting place. Every package in the monorepo will have their own `package.json` and their own dependencies, though Lerna also can **share** dependencies to save disk space. More on that in the next sections.




## Add a shared `dependency` or `devDependency` using `lerna add`

You can just use `npm install packagename` from inside the package directory, which will update the `package.json` and `package-lock.json` files as well as add/update the `node_modules` folder. 

You can use Lerna to add a package from the global npm registry to *ALL* your packages as follows:
```
cd /path/to/monorepo
lerna add react       # add 'react' dependency to everything in packages/ directory
```
This has the same effect as `npm install react --save` in each project in your `packages/` directory. You can also install into dev dependencies using the `--dev` flag:
```
lerna add webpack --dev            # add 'webpack' to devDependencies
```




## Add `dependency` or `devDependency` to a single project wit `lerna add --scope`

If you are adding a dependency only for a particular package, use the `--scope` parameter as follows:
```
cd /path/to/monorepo
lerna add react --scope=mypackage  # add 'react' to dependencies for `packages/mypackage`
```
If you are using scoped package names, then you need to do the following:
```
lerna add react --scope=@myscope/mypackage
```
You can also use `npm install` for convenience, since it allows you to install multiple packages at once; `lerna add` only does one at a time. However, you have to do some additional housecleaning:
```
cd /path/to/monorepo/packages/mypackage    # cd to local package directory
npm i --S react @myscope/mypackages        # add react and another local package dependency
cd ../..                                   # cd to monorepo root
lerna bootstrap                            # update lerna links
```
At this point, you should **test** that all your projects are building successfully. Next, **commit the changes** to all the affected `package.json` and `package-lock.json` files.




## Install project dependencies with `lerna bootstrap`

The **lerna bootstrap** command is similar to using `npm ci` which uses `package-lock.json` to exactly restore the package dependency tree for first-time initialization, except it works on ALL the projects in your monorepo at once. Bootstrapping also takes care of linking **dependencies between projects** in the monorepo; without it, you may see "module not found" errors pop up in your development environment. 

### Hoisting

The bootstrap `--hoist` flag is used to **optimize disk usage** by moving shared package dependencies into the root level's `node_modules` directory and rewriting `package.json` files accordingly. NPM is smart enough to find these dependencies from the `packages` subdirectory because of the way it looks for them starting from the current directory and up. However, not all Javascript build tools work this way and will break. This is particularly true for Visual Studio Code extensions that use the same command-line tools as a project build system; the workarounds that URSANODE employs are described in the [VSCode Tooling](3-vscode.md) reference.

To use hoisting:
```
cd /path/to/monorepo
lerna bootstrap --hoist
```
This may take a while, and does not always work cleanly. You'll need to understand the inner workings of npm and Javascript package management to figure it out, but here are some starting points:

* You should make sure that all the individual repos are working BEFORE running `lerna bootstrap --hoist`. 
* Hoisting will use only one version of a particular package. If you have multiple versions of a package in your projects, you will get warnings and it may break your code. You will need to resolve this manually by editing `package.json` and rerunning `npm install` in each affected project directory, then try running `lerna clean -y && lerna boostrap --hoist`. Or, **do not use hoisting**.




## Package Versioning with `lerna version`

URSANODE is comprised of many packages with their own `package.json` files. They all share the same version number. The `lerna version` command can update the versions all at once and push changes to the upstream repo.

> Note that **versioning is not the same as publishing**. Publishing refers to posting the update to the NPM Global Package Registry, and we're not doing that yet with URSANODE. There is a separate command, [`lerna publish`](https://github.com/lerna/lerna/tree/master/commands/publish) that does that.

### How Versioning Works

The `lerna version` command does the following:

* interactively prompt for a new version bump
* modify all the `package.json` files
* commit the change to the repo and tag it
* !!! **push the commit to the upstream repo** !!!

The format `major.minor.patch` is the normal versioning scheme (e.g. 0.1.1) using [semantic versioning](https://semver.org/) conventions. 

As URSANODE is still in the alpha state of development, we are using **prerelease** conventions: if the `major` number is 0, then the version incrementing looks like this:
```
0.0.1-alpha.1 ---> 0.0.1-alpha.2
```
You can read more about the [lerna version variations](https://github.com/lerna/lerna/tree/master/commands/version). These are the options, corresponding to semantic versioning conventions:

* `lerna version prerelease`
* `lerna version minor`
* `lerna version major`
* `lerna version patch`

You can also run the command interactively:

* `lerna version`

Or you can set the version directly:

* `lerna version 10.0.0`

### Best Practices for Version Management

The `lerna version` command also **pushes changes and tags to the upstream repo** when it runs, so it's a command you run pretty rarely. If you have multiple Git branches for development and release, you'll need to take that into account. I'm still figuring out the best way to do this, but here's what I'm doing currently.

NOTE: these instructions assume you are using [SourceTree](https://www.sourcetreeapp.com/) for Git management on [GitLab](https://about.gitlab.com/) but you get the idea.

#### PRE-STEP: tidy up the repo and make sure stuff works and is clean

1. Merge all branches to `dev` for integration
2. Fix any errors in `dev` using `fix-` branches
3. When `dev` looks good, glance through the `README` and `docs` folders to ensure they are in good shape.
4. Create a `merge request` from `dev` to `rc` (release candidates) branch, using our merge request template (TBD)
5. Have someone test the `rc` branch
6. Accept the merge request

#### VERSION: to apply version updates you need to do this from your **local** machine:

7. Fetch the repo to dev machine
8. Merge `rc` onto `main` (but **don't** commit yet...make sure option is unchecked in merge dialog)
9. Enter `lerna version prerelease` which will update the version across all packages, add a version tag, AND push to `main` for you!

You are done!



---



# Appendix: Troubleshooting

## How do I reference one package from another?

If you want to add the new package as a dependency to other packages, use the `lerna add` command followed by `lerna bootstrap` from the root level of the monorepo.

```
# add the link one at a time
lerna add @mypackage/mypackage --scope=@mypackage/anotherapp1
lerna add @mypackage/mypackage --scope=@mypackage/anotherapp2
# clean node_modules and relink, consolidating common modules
lerna clean -y && lerna bootstrap --hoist
```

You can then import the packages into other packages, as if they were already npm-installed. 

For **Visual Studio Code** module resolution, you'll need to copy a `tsconfig.json` from one of the package directories so it is at the root (e.g. `gs_packages/ursys/tsconfig.json`, where `ursys` is one of the monorepo packages). 

At minimum the `tsconfig.js` file needs to contain:

```
{
  "extends": "../../tsconfig.build.json",
  "compilerOptions": {},
  "include": [ "src_glob" ]
}
```

Then **reload Visual Studio Code**. The highlighted module editor errors should go away. You will also have to `include` any source directories that you want linted.




## How do I add a lerna package as a dependency? I'm getting an error!

```
npm ERR! 404  '@mypackage/globals@^0.0.0' is not in the npm registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404 It was specified as a dependency of 'app_srv'
```

This seems to indicate a bad reference to a package version, as the current package in `lerna.json` is `"0.0.1-alpha.0"`, not `"0.0.0"`. I updated them manually and it seemed to work. 




##  Can I use lerna anywhere in the directory structure?

**Yes** it will walk up the directory tree until it finds a lerna.json.




## How do I run npm audit in a package? I get ELOCKVERIFY errors!

This is due to npm not liking symlinked files :( The workaround is to use the `npm-audit` utility, which is available at the root of gsgo as a script: `npm run audit`. 




## Version Releases: What is the best way to commit from dev to master?

Our Lerna config allows version management **only** in the master branch. We update our tagged releases in two steps: (1) make an integration branch and test it (2) merge the tested integration branch onto `master` and run the `lerna version prerelease` command.

PRE-STEP:

Note: In the initial stages of development, we just use `dev` instead of formal integration branches. Follow steps 1-3, then in steps 7-9 substitute `dev` for `release-candidates`. 

1. merge all branches to `dev` for integration
2. fix any errors in `dev` using `fix-` branches
3. when `dev` looks good, glance through the `README` and `docs` folders to ensure they are in good shape.
4. create a `merge request` from `dev` to  `releasecandidates` branch, using our template (TBD)
5. have someone test the `release-candidates` merge request branch
6. accept the merge request

VERSION: to apply version updates you need to do this from your **local** machine:

7. fetch the repo
8. merge `release-candidates` onto `master` (but **don't** commit yet...make sure option is unchecked in merge dialog)
9. enter `lerna version prerelease` which will update the version across all packages, add a version tag, AND push to `master` for you!




## Can I open packages/mypackage as a Visual Studio Code workspace root, or do I have to open the monorepo root?

Yes, you can just open the subproject root BUT you have to duplicate some configuration files: 

* `tsconfig.json` that `extends` the `tsconfig.build.json` file in the monorepo root. Edit it so the path can be found. This file is required by `@typescript-eslint` to know how to compile source files, and you need to constomize it to your project folder structure.

The other configuration files should not require copying. ESLint, for example, will search backwards up the directory chain until it finds a config file. In VSCode, Typescript will stop searching at the root of the project.

In URSANODE, I sometimes define the script `npm run local` as an alias for running the local build, and `npm run ..package` as a way to invoke a different package.




## When I add a new package to the monorepo, the version is out of synch!

I think this occurs when you make a new package by duplicating an existing one, followed by using `lerna bootstrap --hoist`. You might be able to avoid it if you use `lerna create` for creating packages. The internet is not clear on what actually is happening behind the scenes.

To resolve the issue, I've edited all the package versions manually to make sure they all match. I am not sure if there is a better way to do this. 
