/**
 * 
 * 
 * 
 */

var port = process.env.PORT || 8080;
var basicauth = process.env.basicauth || 'nickolanack:nick';
console.log('Running bridge with custom http server: ' + port + ', and ' + basicauth + ' for server connections');
var http = require('http');

var rproxy = require('node-rproxy');
var Bridge = rproxy.Bridge;
var TinyServer = require('tinywebjs');

var data = {};
var domains = [];

var getData = function() {

	return {
		'default': data,
		'domains': domains
	};

}

var bridge = new Bridge({
	server: (new TinyServer({
		port: port,
		documentRoot: __dirname + '/html/'
	}).addHandler('count', function(request, response) {

		response.end(JSON.stringify(getData()));

	})).server,
	basicauth: basicauth
});

rproxy.util.logBridgeProxy(bridge);



var clients = 0;
var servers = 0;
var paired = 0;
var closed = 0;
var buffers = 0;



var getDomain = function(ws) {

	var domain = ws.upgradeReq.url.toLowerCase();
	if (!domain) {
		domain = 'default';
	}

	if (domains.indexOf(domain) < 0) {
		domains.push(domain);
	}

	return domain;

}

bridge.on('server.connect', function(ws) {
	servers++;

	getDomain(ws);

	updateData();
}).on('client.connect', function(ws) {

	getDomain(ws);

	clients++;
	updateData();
}).on('server.close', function() {
	servers--;
	updateData();
}).on('client.close', function() {
	clients--;
	updateData();
}).on('pair', function() {
	clients--;
	servers--;
	paired++;
	updateData();
}).on('unpair', function() {
	paired--;
	closed++
	updateData();
}).on('buffer.create', function() {
	buffers++;
	updateData();
}).on('buffer.close', function() {
	buffers--;
	updateData();
});

var updateData = function() {

	data = {
		'primed-server-conections': servers,
		'waiting-client-conections': clients,
		'active-bridges': paired,
		'closed-bridges': closed,
		'open-buffers': buffers
	}
}