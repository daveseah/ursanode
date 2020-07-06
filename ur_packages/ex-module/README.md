# Javascript Modular Browser Example

Javascript as of 2019 does not have a universal module loading standard, though it is getting close. In practice there is a difference between native server-side modules running in the NodeJS environment and native client-side code running in a web browser. 

To create a universal development system that handles different in module declaration syntax, a minimum two-stage toolchain is required: a **transpiler** to rewrite module syntax to a common format under control of a **bundler** that packages multiple files into one. In practice, multiple stages in the bundler tool chain handle additional transformations such as code optimization, support templating and alternative script languages, create distribution packages, and so on. 

In 2020 **Webpack** is still the most popular bundler because it can technically do everything you need, but it is not an elegant tool. For this example, I'm using an alternative called **[Parcel][parceljs]**, which is a zero configuration tool that does most of what Webpack does. 

## Building and Running

The build process is run from the command line with NodeJS and Git as prerequisites. If you don't have these installed, see `docs/10-tools/1-install.md` for instructions how to do it.

Once you have the dev prereqs installed, `cd` to the `ursanode/ur_packages` directory and start the build process:
```
cd ~/your-path-to/ursanode/
npm run bootstrap
npm run ex-module
```

The [Parcel][parceljs] build tool will run and serve the HTML file in your default web browser. Type **ctrl-c** to quit the webserver.

#### Side Notes

- For visual consistency across browsers, the base CSS is ["normalized"][normalized] by importing `normalize.css` via the main stylesheet `style.css`. This practice was introduced in 2012.

[parceljs]: https://parceljs.org
[requirejs]: https://requirejs.org/docs/history.html
[amd]: https://github.com/amdjs/amdjs-api
[normalized]: http://nicolasgallagher.com/about-normalize-css#normalize-vs-reset
