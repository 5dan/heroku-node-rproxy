/**
 * keep this in crontab
 * 	    PATH=/usr/bin:/bin:/usr/local/bin
 * 		* * * * * node /pathto/cron.js >/somelogpath/.cronlog 2>&1 
 */




var exec = require('child_process').exec;
var trim = require('trim');
var fs = require('fs');

var cmd=null;
var running=null;


process.chdir(__dirname);



exec('echo $PATH', function(err, stdout, stderr){
	console.log(stdout);

});


try{
	cmd=require('./.tcpmecommand.json');
}catch(e){

}


	



exec('ps -Af | grep \'examples/tcpme.js\' ', function(err, stdout, stderr){

	//console.log(stdout);
	var lines=trim(stdout).split("\n").filter(function(l){return l.indexOf("grep")===-1});
	if(lines.length){
		console.log('Running');
		running='node'+lines[0].split('node').pop();
		console.log(running);

		if(!cmd){
			console.log('Saved');
			fs.writeFile('./.tcpmecommand.json', JSON.stringify([running]));

		}

	}else{
		console.log('Not Running!');

		if(cmd){

			console.log('Restarting: '+cmd[0]);

			exec(cmd[0]+' >.log 2>&1 &', function(err, stdout, stderr){
			
				console.log('ok');

			});

		}

	}


});