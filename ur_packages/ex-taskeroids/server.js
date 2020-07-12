/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

   Very Basic Server

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

const { StartBasicServer } = require('@ursanode/ex-express');

const options = {
  port: 8080,
  static: `${__dirname}/htmldocs`
};

StartBasicServer(options, server => {
  const { port } = server.address();
  console.log('taskeroids server started!');
  console.log(`.. point browser to http://localhost:${port}`);
  console.log('.. type CTRL-C to stop the server');
});
