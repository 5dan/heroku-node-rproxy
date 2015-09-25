/**
 * 
 */

var rproxy=require('node-rproxy');
var TCPAutoConnect=rproxy.TCPAutoConnect;
new TCPAutoConnect({source:process.argv[2], destination:process.argv[3]});
