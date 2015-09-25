# heroku-node-rproxy

[![Build Status](https://travis-ci.org/nickolanack/heroku-node-rproxy.svg?branch=master)](https://travis-ci.org/nickolanack/heroku-node-rproxy)


This is (still) a proof of concept, I want some apps to be able to tunnel in and out of private networks using a service such as heroku as a proxy server. however only 80, and 433 are open on heroku so this is an attempt to make that work...

although this project is meant to work on heroku, it should work on any public server with nodejs and npm installed. 
the server uses environment variables from heroku, or from command line.

btw: heroku 



A quick start to getting the server (bridgeproxy) running locally

```bash

#run the server http+ws
PORT='80' basicauth='nickolanack:nick' node index.js

```
Thats it. The server is running, and will pair websocket connections.
There are two types of connections, 
client and server connections, any websocket that connects with basicauth matching env.basicauth
is considered a server connection your app should provide plenty of these, and connect new ones
to the server as they are consumed. (ie: autoconnectproxy.js form node-rproxy)


A practical example...

#how to ssh into an unreachable computer

heroku times out any connection that is idle for 30 seconds. right now that will affect this example. 
although it is an easy fix, I am going to leave that out of this example for now becuase heroku free 
apps must sleep for at least 6 hours a day, and some thought needs to go into ensuring that it does
allow for that

Assuming that you can at least physically log into the computer to initiate this application,
this example shows how to provide public ssh access to any computer in a private network, using heroku as a proxy!

##get bridgeproxy running on heroku

run the following from anywhere node, npm and the heroku toolchain is installed
```bash

git clone https://github.com/nickolanack/heroku-node-rproxy.git
cd heroku-node-rproxy
heroku create # should respond with some app name, ie: still-sea-5733 use this later
heroku config:set basicauth=joesmith:password 
  # set the username password you want this should be used later
git push heroku master

```

Great the heroku app should be running a web app with websockets. node-rproxy bridgeproxy will be ready to connect clients on port 80 or 443
you can visit the site at https://still-sea-5733.heroku.app.com (replace still-sea-5733 with he app name given by heroku)

##get tcpautoconnectproxy running on a private computer 

Obviously you need to have access to the private computer, if you don't then maybe you should not be doing this in the
first place!!! 

It is assumed that this computer is in a private network or otherwise unreachable, becuase why else would you need this.

```bash

git clone https://github.com/nickolanack/heroku-node-rproxy.git 
cd heroku-node-rproxy
npm install
node examples/sshme.js ws://joesmith:password@still-sea-5733.herokuapp.com 
  # make sure to replace app name from heroku and the username password 

# you probably want to run this in the background: 
# node examples/tcpme.js ws://joesmith:password@still-sea-5733.herokuapp.com 22 > /dev/null 2>&1 &

```

OK heroku should be passing new connections back to that computer as they are recieved, and they should end up at port 22
to connect a terminal from some other location you will need a tcp to ws wrapper (node-rproxy provides one also)

here is how to set up a remote computer to ssh over ws
remote computer
```bash

# skip this if you set up heroku here already.
git clone https://github.com/nickolanack/heroku-node-rproxy.git 
cd heroku-node-rproxy

# but do this (need it's dependencies)

npm install
node examples/sshclient.js ws://still-sea-5733.herokuapp.com

# you probably want to run this in the background: 
# node node examples/tcpclient.js ws://still-sea-5733.herokuapp.com > 9104 /dev/null 2>&1 &

ssh user@localhost -p 9104

```

that works for me...
