/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  Custom NextJS Server

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const URSERVER = require('@ursanode/ursys/server');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const SCRIPT_PATH = path.relative(`${__dirname}/../..`, __filename);
const RUNTIME_PATH = path.join(__dirname, '/runtime');

(async () => {
  console.log(`STARTING: ${SCRIPT_PATH}`);
  await URSERVER.Initialize();
  await URSERVER.StartServer({
    serverName: 'GEM_SRV',
    runtimePath: RUNTIME_PATH
  });
  const { port, uaddr } = URSERVER.GetNetBroker();
  console.log(`SERVER STARTED on port:${port} w/uaddr:${uaddr}`);
})();

/// START CUSTOM SERVER ///////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ NextJS is loaded as middleware with all its usual features
    except for automatic static optimization.
    We get a chance to intercept routes before passing the request to
    to the default handlers provided by NexxtJS.
/*/
app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);
    if (!URSERVER.HttpRequestListener(req, res)) {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
