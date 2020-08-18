This example uses [ExpressJS](https://expressjs.com/) to create a webserver with NodeJS. 

The first time using ExpressJS can be confusing if you are not familiar with how webservers work with browsers with the http protocol, but in general ExpressJS will handle a lot of that stuff for you if you know what you need. For example:

* serving static pages from a directory
* serving dynamic pages using the templating language of your choice
* handling data requests using REST

Since ExpressJS is a NodeJS module, you can write all kinds of Javascript code to handle the various http events and return practically any kind of data you need. Combined with a database and a template engine, you can build a pretty powerful system controlled by your custom code. The alternative is to configure Nginx or Apache, which is a cumbersome prospect.

This example shows how to implement a module that can be loaded by other examples in this repo, and exports functions to start two kinds of servers:

1. A "basic" server that just sends everything from a particular folder to the requesting browser. 
2. "A "fancy" server that implements the basic server _plus_ (1) cookie parsing (2) cross domain asset loading aka CORS, and (3) the EJS template engine that (4) renders a dynamic index page using EJS templating.




