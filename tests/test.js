/**
 * 
 */
var assert=require('assert');
assert.equal(true, true);
var EchoTest=require('./echo.js');

var ws=require('ws');


var series=require("async").series(
		[
function(callback){
	//test direct load
	EchoTest(require('node-rproxy').AutoConnect, require('node-rproxy').Bridge, {echo:9001, bridge:9002, count:20, eachClient:function(client, i){
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
	console.log('');
	var http=require('http');
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
	server.listen(9003);
	
}

],
function(err, results) {
			if(err){
				assert.fail(err.message||err);
			}
			console.log('tests completed successfully');
			process.exit(0);
		});



