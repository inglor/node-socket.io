var fs = require('fs');
var io = require('socket.io-client')
	, socket = io.connect('localhost', {
	    port: 8080
	});

var chokidar = require('chokidar');

function readFileContents(filename, callback){
	fs.readFile(filename, 'utf8', function(err, data) {
		if (err) return callback(err);
		console.log('Read successfully : ' + filename);
		callback(null, data);
	});
}

socket.on('connecting', function () {
	console.log("Initiating connection to socket");
})
socket.on('connect', function () {
	console.log("Websocket connected to http://localhost:8080");
});

socket.on("echo", function (msg) { console.log("Echo: " + msg); })

var watcher = chokidar.watch('/home/inglor/tmp', {ignored: /^\./, persistent: true});
watcher
  .on('add', function(path) {
  	console.log('File', path, 'has been added');
  	socket.emit('echo', "File"+ path+ " has been added" );
  })
  .on('change', function(path) {
  	console.log('File', path, 'has been changed');
  	socket.emit('echo', "File"+ path+ " has been changed" );
  	readFileContents(path, function(err, data){
  		socket.emit('fileData', data);
  	});
  })
  .on('unlink', function(path) {
  	console.log('File', path, 'has been removed');
  	socket.emit('echo', "File"+ path+ " has been removed" );
  })
  .on('error', function(error) {
  	console.error('Error happened', error);
  });
