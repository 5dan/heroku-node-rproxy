/**
 * 
 */

var rproxy=require('node-rproxy');

var TCPWSProxy=rproxy.TCPWSProxy;
var tcp=new TCPWSProxy({source:9104, destination:process.argv[2]},function(){				 
		console.log('Ok, everything looks good, try to run: ssh user@localhost -p 9104');
	});
