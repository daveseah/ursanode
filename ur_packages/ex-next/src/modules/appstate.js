/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  Experimental APPSTATE storage for NextJS

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

const UR = require('@ursanode/ursys/client');

/// CREATE CHEESEBALL STORE ///////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const PR = UR.util.PROMPTS.makeLogHelper('APST');

const STORE = {
  isBrowser: false,
  isServer: true
};
const ROUTE = {
  currentTab: 0,
  currentRoute: '/',
  count: 0
};

if (typeof window === 'object') {
  STORE.isBrowser = true;
  STORE.isServer = false;
  window.STORE = STORE;
  console.log(...PR('browser initialized'));
} else {
  console.log(...PR('server initialized'));
}

function get(key) {
  if (STORE.isServer) console.log(...PR(`WARN: server-side get '${key}'`));
  return STORE[key];
}

function set(key, value) {
  console.log('mode');
  if (STORE.isServer) console.log(...PR(`WARN: server-side set '${key}'`));
  STORE[key] = value;
}

function setRoute(index, path) {
  ROUTE.currentTab = index;
  ROUTE.currentRoute = path;
  console.log(...PR(`APPSTATE: route set ${ROUTE.count++} times`));
}

function getRoute() {
  return ROUTE;
}

function UR_Initialize() {
  if (typeof window === 'object') {
    console.log(
      ...PR('!!! SETTING imperative-style timer in declarative world!')
    );
    setInterval(() => {
      UR.Signal('APPSTATE_TICK', {
        source: 'src:5000ms timer',
        route: `current route ${ROUTE.currentRoute}`
      });
    }, 5000);
    //
    UR.Subscribe('HELLO_URSYS', data => {
      console.log(...PR('RESPONSE "HELLO_URSYS"'));
      let out = '. got';
      Object.keys(data).forEach(key => {
        out += ` [${key}]:${data[key]}`;
      });
      data.lemon = 'yellow';
      out += ` ret [lemon]:${data.lemon}`;
      console.log(...PR(out));
      return data;
    });
  }
}

module.exports = { get, set, setRoute, getRoute, UR_Initialize };
