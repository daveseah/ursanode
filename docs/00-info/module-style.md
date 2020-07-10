# Module Naming

I don't follow the [informal Javascript standards](https://www.robinwieruch.de/javascript-naming-conventions) in the naming of functions, which is
to only use UpperCase for Constructors (and by extension Classes). Perhaps
in time I will shift to it, but here's an example of how I format my code.

This is also defined as the Visual Studio Code snippet `ur-module-example`,
which is located the repo's top-level: `.vscode/module-code-snippets`.

``` js
/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  D.Sri's Module Style
  Somewhat like C# in its lettercasing conventions

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

/// es6: import MODULEorCLASS from './module';
///      import { A, B } from './module';
/// cjs: const MODULEorCLASS = require('./module');
///      const { A, B } = require('./module');

/// CONSTANTS & DECLARATIONS //////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const TYPE_CONSTANT_A = 'A';
let m_collection = [];

/// MODULE HELPERS /////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** jsdoc comment
 *  indent
 */
function m_Method() {
  // helper functions for the module begin with m_PascalCase within module
  m_collection.push('hello');
  return 'hello';
}

/** Extended Comment Block ***************************************************\

    For in-line documentation or longer explanations of key classes
    No need to add/remove comment prefixes for each line. JUST WRITE.

\*****************************************************************************/

/// CLASS DECLARATION /////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** jsdoc comment
 *  indent
 */
class MyClass {
  /* for declaring classes, one per file */
  /* remove if you're making a module (see below) */

  constructor() {
    this.propertyZ = 'Z'; // class instance prop declaration
  }

  MyClassMethod() {
    /* _NOT_ following lowercase method conventions because C# */
    m_collection.push(this.propertyZ);
  }
}
// class static declarations
MyClass.StaticMethod = () => {
  /* properties attached to class declaration are class-wide (static) */
  /* and accessible by instances, but can not access instance vars (duh) */
};
MyClass.STATIC_CONSTANT = 'foo';
MyClass.staticProperty = 'bar';

/// PUBLIC METHODS ////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** jsdoc comment
 *  indent
 */
function PublicA() {}
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** jsdoc comment
 *  indent
 */
function PublicB() {}

/// INITIALIZATION ////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/// wrap code in an "immediately-invoked function expression" wrapper (IIFE)
(function(){
  /* your code to run on module load, once */
})();

/// EXPORTS ///////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/// es6: export default MODULEorCLASS;
///      export { PublicA, PublicB };
/// cjs: module.exports = MODULEorCLASS;
///      module.exports = { A, B };
```

## NOTES

**Choosing type of module import/export**: If you are writing for NodeJS, use the CommonJS ([cjs](http://www.commonjs.org/)) syntax. For browser-side code, using ECMAScript6 ([es6](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_%E2%80%93_ECMAScript_2015)) syntax will generally work with the right tooling (this codebase does).

**Why IIFE for module init**: This odd structure is used as a workaround for early Javascript's weak variable scoping. The `(function(){ ... })()` creates a function body and immediately executes it, and ensures that any `var` use inside of it does not pollute the global namespace. Today, using the newer variable declaration syntax `let` and `const` resolve that issue. 
