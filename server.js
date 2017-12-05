// Servidor: index.js

// Iniciando servidor HTTP
const app = require('http').createServer(index);
const io = require('socket.io').listen(app);
const fs = require('fs');
const port = 3000;

function index(req, res){
	fs.readFile(__dirname + '/index.html', function(err, data){
		res.writeHead(200);
		res.end(data);
	});
};

app.listen(port, function() {
	console.log("Server running and listening port " + port);
});

// Iniciando Socket.IO
var clients = 0;

// Evento connection ocorre quando entra um novo usuário.
io.on('connection', function(socket){
	console.log('Socket id: ' + socket.id + ' connected!');
	// Incrementa o total de clients no site.
	clients++;
	// Envia o total de clients para o novo usuário.
	socket.emit('new socket connected', clients);
	// Envia o total de clients para os demais usuários.
	socket.broadcast.emit('new socket connected', clients);

	/* eventos do socket */

	// Evento disconnect ocorre quando sai um client.
	socket.on('disconnect', function(){
		console.log('Socket id: ' + socket.id + ' disconnected!');
		clients--;
		// Atualiza o total de clients para os demais usuários.
		socket.broadcast.emit('new socket connected', clients);
	});

	// Evento do chat
	socket.on('chat message', function(msg){
		console.log('Socket id: ' + socket.id + ' Digitou:' + msg);
		io.emit('chat message', msg);
	});
});
