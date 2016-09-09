var WebSocket = require('ws');

var wss = new WebSocket.Server({
	port: 8080
}, function() {


	console.log('Listening');

	var ws = new WebSocket('ws://localhost:8080');



});


wss.on('connection', function connection(ws) {

	console.log("Connected");

	console.log(ws.upgradeReq.url.slice(1).toLowerCase());

});