/*//////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  A minimal Express server

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * //////////////////////////////////////*/

const express = require('express');
// express middleware
const cookieParser = require('cookie-parser');
const cors = require('cors');
// utilities
const fs = require('fs');

/// CONSTANTS & DECLARATIONS //////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let m_app; // express instance
let m_http_server; // server instance
let m_options; //

const DEFAULTS = {
  port: 3000,
  static: `${__dirname}/static`,
  templates: `${__dirname}/views`,
  callback: () => {}
};

/// MODULE HELPERS ////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** static is expected. templates is optional */
function m_CheckOptions(options) {
  const { static, templates } = options;
  const error = [];
  if (templates && !fs.existsSync(templates))
    error.push(`template directory: ${templates} doesn't exist`);
  if (!fs.existsSync(static))
    error.push(`static directory: ${static} doesn't exist`);
  // no errors
  if (error.length === 0) return;
  // oh we got errors
  console.log(...error);
  process.exit(1);
}

/// API METHODS ///////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** API: start express server serving only static files
 */
function StartBasicServer(options = {}, callback) {
  m_options = { ...DEFAULTS, ...options, callback };
  m_CheckOptions(m_options);

  // create new Express instance
  m_app = express();

  // basic middleware declarations
  m_app.use(express.static(m_options.static));

  // start it up with convenient listen method
  // see https://expressjs.com/en/api.html#app.listen
  m_http_server = m_app.listen(m_options.port, () => {
    // pass http.Server object to callback if one is defined
    if (m_options.callback) m_options.callback(m_http_server);
  });

  // return http.Server object
  // https://nodejs.org/api/http.html#http_class_http_server
  // extends https://nodejs.org/api/net.html#net_class_net_server
  // extends https://nodejs.org/api/events.html#events_class_eventemitter
  return m_http_server;
}
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** API: start express server with templating and other stuff
 */
function StartFancyServer(options = {}, callback) {
  m_options = { ...DEFAULTS, ...options, callback };
  m_CheckOptions(m_options);

  // create new Express instance
  m_app = express();

  // setup port
  if (m_options.templates) {
    m_app.set('views', m_options.templates);
    m_app.set('view engine', 'ejs'); // use ejs template engine
  }

  // middleware declarations
  m_app.use(express.static(m_options.static));
  m_app.use(cookieParser());
  m_app.use(cors());

  // setup route for / to render
  m_app.use('/', (req, res) => {
    res.render('index', {});
  });

  // start it up with convenient listen method
  // see https://expressjs.com/en/api.html#app.listen
  m_http_server = m_app.listen(m_options.port, () => {
    // pass http.Server object to callback if one is defined
    if (m_options.callback) m_options.callback(m_http_server);
  });

  // return http.Server object
  // https://nodejs.org/api/http.html#http_class_http_server
  // extends https://nodejs.org/api/net.html#net_class_net_server
  // extends https://nodejs.org/api/events.html#events_class_eventemitter
  return m_http_server;
} // end of StartTemplateServer

/// EXPORTS ///////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
module.exports = {
  StartBasicServer,
  StartFancyServer
};
