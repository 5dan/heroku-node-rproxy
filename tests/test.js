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
	
	server.listen(port, function(){

		console.log('listening on: '+port);

		http.get("http://localhost:"+port, function(res) {
			console.log("success: " + res.statusCode);
			
			(new ws('ws://localhost:'+port)).on('open', function(){
				
				console.log('connected client');
				callback(null);
				
			}).on('error',function(error){
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
	(new TinyWeb({port:port})).addHandler('cool',function(req, res){ }
		res.end('success');
	);
	
	
	http.get("http://localhost:"+port+'/cool', function(res) {
		console.log("success: " + res.statusCode);
		var data='';
		res.on('data',function(d){
			data+=d;
		}).on('end',function(){
			
			assert.equals(data, 'success');
			callback(null);
			
		});
		
		
	}).on('error', function(e) {
		assert.fail("Got http error: " + e.message)
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



