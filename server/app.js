var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var _port = process.env.PORT || 8080;
server.listen(_port);

app.get('/', function (req, res) {
	//res.sendfile(__dirname + '/index.html');
	res.send("Websocket is listening at port: " + _port);
});

io.sockets.on('connection', function (socket) {
	console.log("New connection initiated.");
	socket.on("echo", function (msg, callback) {
		callback = callback || function () {};
		socket.emit("echo", msg);
		callback(null, "Done.");
	});
	socket.on("fileData",function (msg, callback) {
		callback = callback || function () {};
		console.log("Contents of file: \'"+msg+"\'.");
		callback(null, "Done.");
	});
});

io.sockets.on('disconnect', function () {
	console.log("Client disconnected");
});