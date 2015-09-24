# heroku-node-rproxy

[![Build Status](https://travis-ci.org/nickolanack/heroku-node-rproxy.svg?branch=master)](https://travis-ci.org/nickolanack/heroku-node-rproxy)

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


#ssh example with heroku

this example show create public ssh access to a computer in a private network, using heroku as a proxy!

```bash

git clone https://github.com/nickolanack/heroku-node-rproxy.git
cd heroku-node-rproxy
heroku create # should respond with some app name, ie: still-sea-5733
heroku config:set basicauth=joesmith:password # set the username password you want
git push heroku master

```

great the heroku app should be running a web app with websockets. node-rproxy bridgeproxy will be ready to connect clients on port 80 or 443
you can visit the site at https://still-sea-5733.heroku.app.com (replace still-sea-5733 witht he app name given by heroku)

set up the computer you want to access with ssh

```bash

git clone https://github.com/nickolanack/node-rproxy.git 
cd node-rproxy
npm install

```

I would just run the following within a node interactive session or put in a file but this must be left running
```js

var rproxy=require('node-rproxy');
var TCPAutoConnect=rproxy.TCPAutoConnect;
new TCPAutoConnect({source:'ws://joesmith:password@still-sea-5733.herokuapp.com', destination:22});

```
ok the app should no be routing connections to the computer @ port 22
to connect a terminal from some other location you will need a tcp to ws wrapper (node-rproxy provides one...)

here is how to set up a remote computer to ssh over ws
remote computer
```bash

git clone https://github.com/nickolanack/node-rproxy.git 
cd node-rproxy
npm install

```

```js
var rproxy=require('../');

var TCPWSProxy=rproxy.TCPWSProxy;
var tcp=new TCPWSProxy({source:9104, destination:'ws://still-sea-5733.herokuapp.com'},function(){				 
		console.log('Ok, everything looks good, try to run: ssh user@localhost -p 9104');
	});

```

```bash

ssh user@localhost -p 9104

```
