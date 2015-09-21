/**
 * 
 * 
 * 
 */

var port=process.env.PORT || 8080;
var basicauth=process.env.basicauth || 'nickolanack:nick';
console.log('Running bridge with custom http server: '+port+', and '+basicauth+' for server connections');
var http=require('http');

var rproxy=require('node-rproxy');
var Bridge= rproxy.Bridge;
var TinyServer=require('tinywebjs');

var data={};


var bridge=new Bridge({server:(new TinyServer({port:port, documentRoot:__dirname+'/html/'}).addHandler('count',function(request, response){
	
	response.end(JSON.stringify(data));
	
})).server, 
basicauth:basicauth});

rproxy.util.logBridgeProxy(bridge);



var clients=0;
var servers=0;
var paired=0;
var closed=0;
bridge.on('server.connect',function(){
	servers++;
	updateData();
}).on('client.connect',function(){
	clients++;
	updateData();
}).on('pair',function(){
	clients--;
	servers--;
	paired++;
	updateData();
}).on('unpair',function(){
	paired--;
	closed++
	updateData();
});

var updateData=function(){
	
	data={
		'primed-server-conections':servers,
		'waiting-client-conections':clients,
		'active-bridges':paired,
		'closed-bridges':closed,
	}
}