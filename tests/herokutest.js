/**
 * 
 */

//run from command line...
var bridge=null;
if(process.argv&&process.argv.length==3){
	if(!process.argc){
		process.argc=process.argv.length;
		bridge=process.argv[2]
	}
}else{
	
	throw Error('Expect cmd line arg, ws://user:pass@heroku-app.com')
}

var weburl='http://'+bridge.substring(bridge.indexOf('@')+1);
var wsclienturl='ws://'+bridge.substring(bridge.indexOf('@')+1);
var echoport=9004;
var echourl='ws://localhost:'+echoport;

console.log('todo: check webserver at: '+weburl);
console.log('todo: start echoserver at: localhost:'+echoport);
console.log('todo: start autoconnectproxy for: '+echourl+' <==> '+bridge);
console.log('todo: connect some clients at: '+wsclienturl);

var assert=require('assert');
var rproxy=require('node-rproxy');
var http=require('http');
var WS=require('ws');

var AutoConnectProxy=rproxy.AutoConnect;
var BridgeProxy=rproxy.Bridge;
var EchoServer=rproxy.EchoServer;


http.get(weburl, function(res) {
	console.log('webserver success: ' + res.statusCode);

	(new EchoServer({port:echoport}, function(){
		var autoconnect=new AutoConnectProxy({source:bridge, destination:echourl});
		
		//and log everything
		rproxy.util.logAutoconnectProxy(autoconnect);
		
	}));
	
	

	


	(new WS(wsclienturl)).on('open', function(){
		var client=this;
		console.log('connected client');
		client.on('message',function(msg){
			
			console.log('recieved: '+msg);
		
		});
		client.send('hello world');
		

	}).on('error',function(e){
		console.log('error client');
		assert.fail('Got ws error: ' + e.message)
	});

}).on('error', function(e) {
	assert.fail('Got http error: ' + e.message+' for: '+wsclienturl);
});