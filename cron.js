/**
 * keep this in crontab
 * 	    PATH=/usr/bin:/bin:/usr/local/bin
 * 		* * * * * node /pathto/cron.js >/somelogpath/.cronlog 2>&1 
 */


/**
 * How to use. 
 *
 * cron.js keeps track of running rpoxy processes. on first use, it checkes the running tasks and stores 
 * the command to start/restart them is a json file. if cron.js is executed using a cron job, then every time it is run,
 * it checks to make sure that a matching process is running for each of the stored commands and restarts them if necessary.
 *
 * to make this work start a number of endpoint tasks: ie:
 * 
 *    node examples/tcpme.js ws://user:pass@still-sea-5733.herokuapp.com/ssh 22 &
 *    node examples/tcpme.js ws://user:pass@still-sea-5733.herokuapp.com/ftp 21 &
 *    node examples/tcpme.js ws://user:pass@still-sea-5733.herokuapp.com/html 80 &
 *
 *    node cron.js 
 *    # out >
 *    # Running (3)
 *	  # Wrote to keepalive file
 *
 * 
 * 
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