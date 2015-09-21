/**
 * 
 * 
 * 
 */

var port=process.env.PORT || 80;
console.log('Running bridge with custom http server: '+port);
var http=require('http');


var Bridge= require('node-rproxy').Bridge;
new Bridge({server:http.createServer(function(request, response){
	response.end('Http Server: ' + request.url);
}), port:port, 
basicauth:'nickolanack:nick'});
