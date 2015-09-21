/**
 * 
 * 
 * 
 */

var port=process.env.PORT || 80;
console.log('Running bridge with custom http server: '+port);
var http=require('http');


var Bridge= require('node-rproxy').Bridge;
var TinyServer=require('tinywebjs');


new Bridge({server:(new TinyServer({port:port})).server), 
basicauth:'nickolanack:nick'});
