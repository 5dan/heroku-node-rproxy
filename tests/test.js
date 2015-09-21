/**
 * 
 */
var assert=require('assert');
assert.equal(true, true);
var EchoTest=require('./echo.js');

var ws=require('ws');
var http=require('http');

var series=require("async").series(
		[
function(callback){
	//test direct load
	EchoTest({echo:9001, bridge:9002, count:20, eachClient:function(client, i){
		client.on('message',function(m){
			console.log('test 0, client '+i+' success');
		});
	}}, function(err, message){

		if(err){	
			assert.fail(err);
		}

		callback(null);

	});
},
function(callback){


	var port=9003
	console.log('Running bridge with custom http server: '+port);

	var server = http.createServer(function(request, response){
		response.end('Http Server: ' + request.url);
	});

	var Bridge= require('node-rproxy').Bridge;
	new Bridge({server:server},function(){
		console.log('hello world server: http+ws');	
		server.close();
		callback(null);
	}, function(){

		assert.fail('should not have connected');

	});

	server.listen(port, function(){

		console.log('listening on: '+port);

		http.get("http://localhost:"+port, function(res) {
			console.log("success: " + res.statusCode);

			(new ws('ws://localhost:'+port)).on('open', function(){

				console.log('connected client');
				callback(null);

			}).on('error',function(e){
				console.log('error client');
				assert.fail("Got ws error: " + e.message)
			});

		}).on('error', function(e) {
			assert.fail("Got http error: " + e.message)
		});

	});

},


function(callback){

	var port=9007
	var TinyWeb=require('tinywebjs');
	(new TinyWeb({port:port})).addHandler('cool',function(req, res){
		res.end('success');
	});


	http.get("http://localhost:"+port+'/cool', function(res) {
		console.log("success: " + res.statusCode);
		var data='';
		res.on('data',function(d){
			data+=d;
		}).on('end',function(){

			assert.equal(data, 'success');
			callback(null);

		});


	}).on('error', function(e) {
		assert.fail("Got http error: " + e.message)
	});

},


function(callback){

	var port=8089;
	var basicauth='nickolanack:nick';
	console.log('Running bridge with custom http server: '+port+', and '+basicauth+' for server connections');
	var http=require('http');


	var Bridge= require('node-rproxy').Bridge;
	var TinyServer=require('tinywebjs');


	var bridge=new Bridge({server:(new TinyServer({port:port, documentRoot:__dirname+'/html/'}).addHandler('count',function(request, response){
		response.end('Cool It worked!!');
	})).server, 
	basicauth:basicauth});
	
	rproxy.util.logBridgeProxy(bridge);

	

	var bridge='ws://nickolanack:nick@localhost:8089'
	var weburl='http://'+bridge.substring(bridge.indexOf('@')+1)+'/count';
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
		var data='';
		res.on('data',function(d){
			data+=d;
		}).on('end',function(){
			
			console.log('http recieved: '+data);
			assert.equal(data, 'Cool It worked!!');
			
		});

		(new EchoServer({port:echoport}, function(){
			var autoconnect=new AutoConnectProxy({source:bridge, destination:echourl, ping:1});
			
			//and log everything
			rproxy.util.logAutoconnectProxy(autoconnect);
			
		}));
		
	

		(new WS(wsclienturl)).on('open', function(){
			var client=this;
			console.log('connected client');
			client.on('message',function(msg){
				
				console.log('recieved: '+msg);
				assert.equal(msg,'hello world');
			});
			var count=5;
			var int=setInterval(function(){
				client.send('hello world');
				console.log('sent: '+'hello world');
				count--;
				if(count<0){
					clearInterval(int);
					client.close();
					console.log('just waiting 5s before finishing happily');
					setTimeout(function(){
						callback(null);
					},5000);
					
				}
			}, 500);

		}).on('error',function(error){
			console.log('error client');
			assert.fail('Got ws error: ' + e.message)
		});

	}).on('error', function(e) {
		assert.fail('Got http error: ' + e.message)
	});
	
	
	

}


],
function(err, results) {
			if(err){
				assert.fail(err.message||err);
			}
			console.log('tests completed successfully');
			process.exit(0);
		});



