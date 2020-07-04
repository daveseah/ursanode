/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  div-printer.js is an ECMAscript-style module, which you'll have to
  read about in detail elsewhere

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

/// LIBRARIES/EXTERNAL CLASSES ////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import SampleClass from "../classes/class-sampleclass";

/// PRIVATE DECLARATIONS //////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const m_name = "Sam Module";

/// PRIVATE HELPERS ///////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/// this function is accessible only from within this module
function m_GetName() {
  return m_name;
}

/// PUBLIC METHODS ////////////////////////////////////////////////////////////
/// These methods will be exported as "named exports"
/// and can be imported using syntax:
/// const { Greeting, PrintDev } = import 'sample-module';
/// They are defined as arrow functions because only arrow functions remember
/// their calling context
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** Simple function to return a string that is returned from a private method
 */
function Greeting() {
  return `Hello World from ${m_GetName()}`;
};
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** Utility function to pass string to the 'codeoutput' div
 * @param {string} str - the string to add to the innerHTML of codeouput
 */
function PrintDiv(str) {
  const div = document.getElementById("codeoutput");
  div.innerHTML += `${str}\n`;
};
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** Return th number of instances that are being managed by SampleClass class.
 *
 */
function CountClassInstances() {
  return SampleClass.NumberOfInstances();
};
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function GetClassInstances() {
  return [instanceA, instanceB];
};

/// MODULE INITIALIZATION /////////////////////////////////////////////////////
/// here we are creating a few instances of the class we imported at the top
/// of the screen, but aren't using th
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let instanceA = new SampleClass();
let instanceB = new SampleClass();

/// EXPORTS ///////////////////////////////////////////////////////////////////
/// an object of functions and instance properties is exported
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export default {
  Greeting,
  PrintDiv,
  CountClassInstances,
  GetClassInstances,
  instanceA,
  instanceB
};
