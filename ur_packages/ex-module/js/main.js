/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  main.js is loaded from index.html as an ECMAscript module as follows:
  <script type="module" src="js/main.js"></script>

  This script runs AFTER index.html has completely rendered; this is the
  default behavior that ECMAscript modules are handled by the browser,
  so there is no need to hook into a 'DOMContentLoaded' event

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

/// LIBRARIES /////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import DIVPRINTER from "./modules/div-printer";
const { Greeting, PrintDiv } = DIVPRINTER;
const { CountClassInstances, GetClassInstances } = DIVPRINTER;

/// INITIALIZATION ////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// DIVPRINTER.Greeting()
const greetingText = Greeting();

// DIVPRINTER.PrintDiv() adds the passed text to a <div> on the page
PrintDiv(greetingText);

// print some other stuff
const numInstances = CountClassInstances();
PrintDiv(`Counted ${numInstances} class instances:`);
const instancesArray = GetClassInstances();
for (let i = 0; i < instancesArray.length; i++) {
  PrintDiv(`${i} - ${instancesArray[i].GetId()}`);
}
