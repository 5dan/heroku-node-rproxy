/**
 * 
 */
var WS=require('ws');
var wsclienturl=null;
if(process.argv&&process.argv.length==3){
	if(!process.argc){
		process.argc=process.argv.length;
		wsclienturl=process.argv[2]
	}
}else{

	throw Error('Expect cmd line arg, ws://heroku-app.com')
}


var client=(new WS(wsclienturl)).on('open', function(){

	console.log('connected client');
	client.on('message',function(msg){

		console.log('recieved: '+msg);
		setTimeout(function(){ client.close() },12000);
	});
	setTimeout(function(){
		console.log('try to send \'hello world\'');
		client.send('hello world');
	},1000);


}).on('error',function(e){
	console.log('error client');
	assert.fail('Got ws error: ' + e.message)
}).on('close',function(){
	console.log('closed');
});

setTimeout(function(){

	var client=(new WS(wsclienturl)).on('open', function(){

		console.log('connected client');
		client.on('message',function(msg){

			console.log('recieved: '+msg);
			setTimeout(function(){ client.close() },10000);
		});
		setTimeout(function(){
			console.log('try to send \'hello world\'');
			client.send('hello world');
		},1000);


	}).on('error',function(e){
		console.log('error client');
		assert.fail('Got ws error: ' + e.message)
	}).on('close',function(){
		console.log('closed');
	});
},2000);