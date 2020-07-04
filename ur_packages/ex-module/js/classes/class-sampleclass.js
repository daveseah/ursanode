/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  class-sampleclass.js is an ECMAscript-style module that exports a
  class declaration.

  For those of you coming from other C++/C# like languages, Javascript
  does not have a fully equivalent class syntax with public, private,
  static distinctions. The code style of this module is designed to
  private those features to some degree, and varies from established
  Javascript conventions:

  * The Javascript standard reserves PascalCase capitalization for
    constructor functions only, with all other methods and properties
    using camelCase. I use PascalCase for all methods and functions because
    this is the more common use case and I like to tell at-a-glance what
    a function is.
  * I use m_camelCase for module-defined properties, which are the
    equivalent of "private static properties" in another language.
    m_PascalCase() is similarly used for module-defined function of
    a private nature.
  * I use UPPER_CASE for constants attached to the class object,
    and these are equivalent to public static properties. Static public
    methods use regular PascalCase.

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

/// PRIVATE DECLARATIONS //////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/// private static property
const m_instances = [];
let m_idcounter = 0;
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/// private static method
function m_CountInstances() {
  return m_instances.length;
}
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/// private static method
function m_GetNewId() {
  const newid = `ID_${(m_idcounter++)}`;
  console.log(`newID created '${newid}`);
  return newid;
}

/// CLASS DECLARATION /////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class SampleClass {
  constructor() {
    // use private methods to create a unique id
    this.id = m_GetNewId();
    // use private data structures
    m_instances.push(this);
    // update a public static property
    SampleClass.LAST_ID = this.id;
  }

  // a method
  GetId() {
    return this.id;
  }
} // SampleClass

/// STATIC CLASS METHODS ///////////////////////////////////////////////////////
/// public static property
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
SampleClass.LAST_ID = 0;
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/// public static method
SampleClass.NumberOfInstances = () => {
  // return value from private data structure
  return m_CountInstances();
};

/// EXPORT CLASS //////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/// export the class, suitable for use with 'new' keyword
export default SampleClass;
