/**
 * 
 * 
 * 
 */

var port=process.env.PORT || 8080;
var basicauth=process.env.basicauth || 'nickolanack:nick';
console.log('Running bridge with custom http server: '+port);
var http=require('http');


var Bridge= require('node-rproxy').Bridge;
var TinyServer=require('tinywebjs');


new Bridge({server:(new TinyServer({port:port, documentRoot:__dirname+'/html/'})).server, 
basicauth:basicauth});
