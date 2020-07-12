# Using Visual Studio Code with URSANODE

I have my Visual Studio Code (VSCode) environment setup to provide the following services:

* Typescript and React syntax support
* Live code linting with ESLint
* Applying the AirBNB ESLint rule set
* Relaxing ESLint rules that I find annoying
* Reformat on Save using Prettier
* Code templates for my module styles (snippets)

If you don't want to use my opinionated settings, you'll have to edit the following files to disable these features or substitute your own:

* `.vscode/settings.json` 
* `.editorconfig` 
* `.eslintrc.js`

If you *DO* want to use them, follow these instructions!

1. [Download and install VSCode](https://code.visualstudio.com/download).

2. Now open the `ursanode.code-workspace` project file at the root level of the `ursanode` directory. This configures the working environment to match mine through the `.vscode/settings.json` file.

3. Install the suggested VSCODE extensions which should pop-up in the editor. These are also marked in VSCode's EXTENSIONS tab on the left sidebar, or you can see the list in `.vscode/extensions.json`.  

---

# Technical Information

Setting up VSCode's toolchain requires an understanding of Javascript's ad-hoc best tools and practices. Many of the most popular tools use a "middleware/plugin" pattern that is incompletely documented, and the tool chains are quite fragile, breaking frequently when one key package is updated. Fortunately, most of it is open source so you can look at the actual code to determine what is going on. 

I'm documenting my understanding of how it works here so I don't forget it. 

## How it fits together

The surprising truth is that there are *TWO* separate development toolchains in use. Visual Studio uses one toolchain to do **live code linting** through installed **extensions**. The actual **compilation** work is done by a different toolchain and is controlled through a **npm build script** usually defined in `package.json`. 

In most cases, the two toolchains share the same configuration files without modification, but sometimes a settings override must be placed inside a Visual Studio Code setting. 

When you clone the project, you automatically get everything that works together. Here's what's included:

* `.editorconfig` - Specify default tab and spacing rules through **EditorConfig** extension (ext `editorconfig.editorconfig`)
* `.nvmrc` - specific the version of node as managed by **Node Version Manager**. The contents of the file is read by the `nvm use` command.
* `.eslintrc.js` - Specify linting toolchain through **TypeScript** parser and expected plugins. This config is used by the **ESLint** extension (ext `dbaeumer.vscode-eslint`) and also by the build tool chain. 
* `prettierrc.js` - Specifiy automatic code formatting through the **Prettier** extension (ext `esbenp.prettier-vscode`)
* `tsconfig.json` - Specify critical **Typescript configuration** for making the tricky Typescript linting work with the ESLint extension. It 
* `.vscode/settings.json` - Specify editor defaults not handled by `.editorconfig`, *AND* critical **ESLint extension settings** to make it work with the editor: `eslint.validate` and `eslint.workingDirectories`.

The listed extensions rely on the following packages. You shouldn't have to reinstall these yourself as they are part of the root directory's `package.json` already, but I provide them for reference. 
```
npm i -D eslint@^6.8.0 typescript@^3.8.3 prettier@^1.19.1
npm i -D @typescript-eslint/eslint-plugin@^2.24.0 @typescript-eslint/parser@^2.24.0
npm i -D eslint-config-airbnb-typescript@^7.2.0 eslint-config-prettier@^6.10.0 
npm i -D eslint-import-resolver-typescript@^2.0.0 eslint-plugin-import@^2.20.1
npm i -D eslint-plugin-jsx-a11y@^6.2.3 eslint-plugin-react@^7.19.0 eslint-plugin-react-hooks@^2.5.1
```
Note 1: The package versions are important for compatibility with each other, and the entire block should be considered as a set. The ESLint, Typescript, Prettier, and AirBnb linting rules+plugins are all updated by different organizations so compatibility requires *CAREFUL* updating. 

Note 2: the **order of application of rules** in the `plugins` and `extends` fields in `.eslintrc.js` is critically important. In general, the `prettier`-related plugins/rules always come last and `typescript`-related plugins/rules come first. In the very last `rules` section, this is where we (1) add our own overrides and (2) remove any whitespace formatting-related rules and uncaught rule conflicts. For example, when you see TWO versions of `no-undeclared-vars` errors, I just remove the `eslint`  one.

Note 3: For ESLint and Prettier to work, you have to be sure that they are finding their configuration files. Otherwise, you may find that Live Linting doesn't work, or Prettier doesn't autoformat on save. There are multiple settings for Visual Studio Code, Typescript, the Prettier Extension, the ESLint Extension, and Workspace settings that all must be correct for Live Linting to work. 

Note 4: Even if the Live Linting fails, the project will still probably build. That's because compiling/building/packaging is handled by a completely different toolchain through **Webpack**. Typescript is shared between both toolchains, but the way it is invoked is different.

## High Level Configuration

To summarize how this works in our lerna monorepo with multiple `.code-workspace` options:

* ESLint extension reads its config file by walking up the tree, the root `.estlintrc.js`
* Typescript (through `@typescript-eslint/parser`) reads its `tsconfig.json` file from `.eslintrc.js`'s `parserOptions.tsconfigRootDir` that is set to `__dirname`.
* `.eslintrc` implements the order of rules for typescript, airbnb, and eslint recommended. It also should disable any whitespace formatting elements so only Prettier handles that. ESLint is only used to flag errors.
* prettier is invoked by extension, which looks for a `.prettierrc.js` file in the project root. To be sure it's using that prettier install, we set `.vscode/settings.json` to set `prettier.prettierPath` to `"./node_modules/prettier"` in the root project. 
* for Prettier subproject workspaces, we require a VSCode `.code-workspace` to exist with the `prettier.prettierPath` to point to the root `"../../node_modules/prettier"` . That's because prettier is only installed at the root level (it might not be necessary if it's globally installed through `lerna add`...will have to test that).
* for Typescript, the `tsconfig.json` lives at multiple levels because it's required to set different module paths in `compilerOptions.paths`, and include different subdirectories to parse in `include`. Otherwise eslint will fail to parse module paths, and typescript files will not be parsed at all. 
* Module resolution for Live Linting is also handled through the `@typescript-eslint/parser` and it will not work unless `.eslintrc.js` uses the `import` plugin.

## Example Configurations

**`.eslintrc.js`** in root directory (critical rules only)

```
module.exports = {
  ...
  // note that we're not loading the prettier config or plugin because
  // in visual studio code, we're relying on the extension to do it on save
  // via a different mechanism
  plugins: ['@typescript-eslint', 'react', 'import'],
  settings: {
    'import/resolver': {
      // This makes module resolution in VSCode work. Otherwise, it will flag
      // modules as undeclared because it can't find them. The import plugin
      // will read the tsconfig.json file to parse each file.
      // This also requires a .vscode/settings.json tweak:
      //   eslint.workingDirectories:[{mode:'auto'}]
      // See https://github.com/microsoft/vscode-eslint/issues/696 for hints
      // regarding relative directories, monorepos, and eslint 6 changes
      typescript: {
        directory: './tsconfig.json'
      }
    }
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/eslint-recommended', // transform typescript rules
    'plugin:react/recommended', // handle jsx syntax
    'airbnb-typescript' // add airbnb typescript rules
  ],
  parserOptions: {
  	...
    project: './tsconfig.json', // where to look for root ts config
    tsconfigRootDir: __dirname //  monorepo hack
  },
  rules: {
  	...
	}
};

```

### .eslintrc magic naming conventions

ESLint capabilities are extended through external modules, loaded through npm, that define either "rules", "configurations" (sets of rules), or "plugins". These npm modules tend to use similar names but different configuration semantics, and you can omit parts of the filename. It's not just you; ESLint configuration is opaque to casual inspection. I'll try to explain how I think it works below. 

ESLint is essentially checks your code against a set of **rules** in a process called "linting". A lot of rules are already built-into the ESLint core engine, but users frequently don't want all of them so you can override them. For convenience, you can collect a set of rules together as a **configuration**. To add rules that ESLint doesn't support natively, a **plugin** is written to add both code and rules to implement whatever extended syntax is desired. 

ESLint's configuration is stored as JSON in a file called `.eslintrc`. Alternatively, you can export a Javascript object from `.eslintrc.js`. I use the latter so I can add comments to my configuration (since comments are not part of the JSON standard).

#### ADD A PLUGIN

To add an ESLint plugin to the chain, you add an entry to the config object's `plugins` entry, which is an array of npm modules. You can put the full package name here, but many tutorials use the "shortcut" versions of names. See this example of a project's `plugins` entry with their corresponding npm package defined in `package.json` under `devDependencies`:
```
  plugins: [
    'react',              // refers to eslint-plugin-react
    '@typescript-eslint', // refers to @typescript-eslint/eslint-plugin 
    'import'              // refers to eslint-plugin-import
  ],
```
The general rule is that in the plugins field, you can just drop the `eslint-plugin` portion of the name.

In addition to rules and configuration, ESLint plugins has access to the entire linting lifecycle, which means they can do more than just define rules and configurations. To dig into what is going on, you have to go to the source code to gain real insight. Documentation is generally poor.

### ADD RULES

To use an ESLint plugin's **rules**, you add an entry to the config object's `extends` entry, which holds an array of strings. These strings are the **name of the module** (which can be a plugin or configuration) and possibly what **part** you want to use. The general form is this:

>  `[plugin:[eslint-plugin-]package_name/configuration_name`

A special case are the built-in ESLint configurations. This syntax uses the form `:configuration_name` instead of `/configuration_name`. For example:

> `eslint:recommended`

As an example, here's a project's `extends` entry (there are no built-in ESLint configs in use):
```
  extends: [
    'plugin:react/recommended',                     // eslint-plugin-react config 'recommended'
    'plugin:@typescript-eslint/eslint-recommended', // @typescript-eslint/eslint-plugin config 'eslint-recommended'
    'airbnb-typescript',                            // eslint-config-airbnb-typescript config
    'prettier',                                     // eslint-config-prettier default config
    'prettier/@typescript-eslint',                  // eslint-config-prettier @typescript-eslint config
    'prettier/react'                                // eslint-config-prettier react config
  ],
```
Important note: these rules are **applied in order**, and this order can be very important. Some configs disable rules as well as adds them, and this can lead to conflicts (see next section).

You can work around some conflicts or otherwise **customize** rules through the ESLint config `rules` field. This is where you can **cherry-pick rules** to add or remove from what you've loaded in `extends`. Here's an example from a project's `.eslintrc.js` config file:
```
  rules: {
    /* allow classroom debugging by researchers */
    'no-console': 'off',
    'no-debugger': 'warn',
    'no-alert': 'warn',
    /* ursys style overrides */
    'spaced-comment': 'off',
    'camelcase': 'off',
    'comma-dangle': ['error', 'never'],
    'no-underscore-dangle': 'off',
    'lines-between-class-members': 'off',
    'no-bitwise': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-use-before-define': 1,
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/quotes': 'warn',
    ...
 }
```


### Conflicts

ESLint rules and plugins often conflict with each other and it is difficult to tell why unless you dig deep into EVERY configuration and rule you are loading. Sometimes new versions of ESLint introduces breaking changes that are not documented clearly, and sometimes part of the ESLint plugin chain becomes out of date or introduces its own incompatibilities through undocumented behavior. You can lose days to struggling with the tool chain, particularly if you are combining several best practices into a single project. 

# Troubleshooting

## Can't Resolve Module Path in Live Linting, but it Still Compiles and Runs

Make sure the closest `tsconfig.json` file includes the source you're trying to import. ESLint is using that configuration file via the typescript parser option we've specified. If there isn't a `tsconfig.json` at the package directory level, then you must add one. Here's the one for `gs_packages/app_srv`

```
{
  "extends": "../../tsconfig.build.json",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "ursys/*": ["ursys/*"],
      "app/modules/*": ["src/app/modules/*"],
      "app/*": ["src/app/*"],
      "util/*": ["src/app/util/*"],
      "step/*": ["src/step/*"],
      "config/*": ["config/*"]
    }
  },
  "include": ["src/**/*", "ursys/**/*", "config/*"],
  "exclude": ["node_modules"]
}
```

The directory structure looks like this:

```
app_srv/
    config/
    src/
        app/
            boot/
            static/
            modules/
            views/
                ViewMain/
        util/
        step/
        assets/
    ursys/
        common/
        chrome/
        node/
    .babelrc
    package.json
    package-lock.json
    tsconfig.json
```

You can see that the `tsconfig.json` files is defining both `compilerOptions` for path aliases (the `path` property) and `include` for which files that will be processed by Typescript. It is this latter setting that matters for ESLint. The `compilerOptions` one is used by webpack when it invokes its typescript loader (maybe...I haven't confirmed this). 
