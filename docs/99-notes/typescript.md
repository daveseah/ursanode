# TypeScript Type Declarations

This is a compact syntax reference for basic TypeScript needs. 

A useful reference: TypeScript [declaration files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) are similar `.h` include files in a C-style language environments. These docs also describe Javascript conventions for creating libraries and modules that work across the different environments.

## Basic Type Assignment

TypeScript type assignments can be inserted into regular Javascript declarations by adding `:type`. Here's a list of the basic ones:

* `:any`
* `:object`
* `:number`
* `:string`
* `:boolean`
* `:void`
* `:undefined`
* `:null`

To declare an **array of a type**, append `[]` (e.g. `let names = string[]` to declare an array of strings)

## Defining Types

According to [deep dive](https://www.typescriptlang.org/docs/handbook/declaration-files/deep-dive.html) there are only a few ways to introduce a type:

* A type alias declaration (`type sn = number | string;`)
* An interface declaration (`interface I { x: number[]; }`)
* A class declaration (`class C { }`)
* An enum declaration (`enum E { A, B, C }`)
* An import declaration which refers to a type

## Using "Type Signatures"

When you want to reuse a previously-defined type, there are two keywords with subtle differences:

* **`declare`** is like `extern` in C++, telling the TS compiler that this is *already exists* and has a particular **type signature** (see below). For example, if you are referring to a property you loaded on the global `window` object, you can use this keyword.

* **`type`** defines a [type alias](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases). You can use it in place of `declare` to *name* a type signature, and then use it anywhere code as a convenient shortcut. 

* **`interface`** defines the shape of types that use **dotted notation** (e.g. objects, classes) like C#, or abstract base classes in C++. 

You use either `declare` or `type` in front of the type signature. The type signature syntax is the same. 

## Examples of Type Signatures

#### Basic Types
``` ts
// basic types
declare let a:any
declare let obj:object
declare let num:number
declare let str:string
declare let flag:boolean

// special: undefined, null can be assigned to a typed variable
let lastValue:number = undefined;
// special: void is used to declare functions that don't reurn

// forward declarations (can overload!)
declare function funcType (a:any, num:number):void;
declare function funcType (a:any, obj:object):boolean;

// function parameters as type
type LooperFunction = function(loopCount:number):void;
function Loop( f:LooperFunction ) {};

// define a dotted notation object
// can be used as a type or to extend a class
interface BaseShape {
  aProperty: string;
  aFunction: function (cmd:string, batch:string[]):string[];
  optionalProperty?: number;
  readonly isValid:boolean;
}
// examples (WIP...these are probably broken)
declare function greet(setting:MyObjectShape):void;
interface Shape extends BaseShape {
  anotherProp: string;
}
declare class Rectangle implements Shape {}

```
