# heroku-node-rproxy

[![Build Status](https://travis-ci.org/nickolanack/heroku-node-rproxy.svg?branch=master)](https://travis-ci.org/nickolanack/heroku-node-rproxy)]

this is going to be a web-socket proxy app with an html interface for configuration (possibly)

This is a proof of concept, I want some apps to be able to tunnel in and out of private networks using a service such as heroku as a proxy server. however only 80, and 433 are open on heroku so this is an attempt to make that work...

although this project is meant to work on heroku, it should work on any public server with nodejs and npm installed. 

the server uses environment variables from heroku, or from command like like so.
```bash

#run the server http+ws
PORT='80' basicauth='nickolanack:nick' node index.js

```
Thats it. The server is running, and will pair websocket connections.
There are two types of connections, 
client and server connections, any websocket that connects with basicauth matching env.basicauth
is considered a server connection your app should provide plenty of these, and connect new ones
to the server as they are consumed. (ie: autoconnectproxy.js form node-rproxy)

