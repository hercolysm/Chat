// Servidor: index.js

// Iniciando servidor HTTP
const app = require('http').createServer(index);
const io = require('socket.io').listen(app);
const fs = require('fs');
const port = 3000;

global.conn = require('./db');

var chat = [];

/* funções */

//global.db = require(__dirname + '/db');

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
		console.log('Socket id: ' + socket.id + ' say:' + msg);
		var row = [{'agent': socket.id, 'message': msg}];
		global.conn.insert(row);
		io.emit('chat message', msg);
	});

	socket.on('chat typing', function(){
		console.log('Socket id: ' + socket.id + ' is typing...');
		io.emit('typing', socket.id);
	});

	//
	global.conn.findAll((err, docs) => {
		console.log("Buscando mensagens...");
		if (err) { console.log(err); }
		chat = docs;
		socket.emit('chat', chat);
	});
});

/*setTimeout(function(){
	global.conn.findAll((e, docs) => {
		if (e) { console.log(e); }
		console.log("Retorno:");
		console.log(docs);
	});
}, 10000);
*/
