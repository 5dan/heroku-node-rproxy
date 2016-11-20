/**
 * keep this in crontab
 * 	    PATH=/usr/bin:/bin:/usr/local/bin
 * 		* * * * * node /pathto/cron.js >/somelogpath/.cronlog 2>&1 
 */




var exec = require('child_process').exec;
var trim = require('trim');
var fs = require('fs');

var cmds=null;
var running=null;


process.chdir(__dirname);



exec('echo $PATH', function(err, stdout, stderr){
	console.log(stdout);

});


try{
	cmds=require('./.tcpmecommand.json');
}catch(e){

}


	



exec('ps -Af | grep \'examples/tcpme.js\' ', function(err, stdout, stderr){

	/*console.log(stdout);*/
	var lines=trim(stdout).split("\n").filter(function(l){return l.indexOf("grep")===-1});
	if(lines.length){
		console.log('Running ('+lines.length+')');


		var nodecmds=[];
		lines.forEach(function(line){
			running='node'+line.split('node').pop();
			console.log(running);
			nodecmds.push(running);

		});
		

		if(!(cmds&&cmds.length)){

			console.log('Wrote to keepalive file');
			fs.writeFile('./.tcpmecommand.json', JSON.stringify(nodecmds));

		}else{

		}

	}





	if(cmds){

		cmds.forEach(function(cmd){

			var isRunning=false;
			lines.forEach(function(line){

				if(line.indexOf(cmd)>=0){
					isRunning=true;
				}

			});

			if(!isRunning){

				console.log('Restarting: '+cmd);

				exec(cmd+' >.log 2>&1 &', function(err, stdout, stderr){
				
					console.log('ok');

				});
			}


		});

		

	}

	


});