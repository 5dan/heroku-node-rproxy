/**
 * 
 * 
 * 
 */

var port=process.env.PORT || 8080;
var basicauth=process.env.basicauth || 'nickolanack:nick';
console.log('Running bridge with custom http server: '+port+', and '+basicauth+' for server connections');
var http=require('http');


var Bridge= require('node-rproxy').Bridge;
var TinyServer=require('tinywebjs');


new Bridge({server:(new TinyServer({port:port, documentRoot:__dirname+'/html/'}).addHandler('count',function(request, response){
	
	
	response.end('Cool It worked!!');
	
	
	
})).server, 
basicauth:basicauth});
