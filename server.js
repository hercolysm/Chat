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

// Autenticação do client
io.use((socket, next) => {
	var room = socket.handshake.query.channel;
	if (room!=1 && room!=2) {
		return next(new Error('Falha na autenticação'));
	}
	return next();
});

// Evento connection ocorre quando entra um novo usuário.
io.on('connection', function(socket){
	console.log('Socket id: ' + socket.id + ' connected!');
	
	// Incrementa o total de clients no site.
	clients++;
	// Envia o total de clients para o novo usuário.
	socket.emit('new socket connected', clients);
	// Envia o total de clients para os demais usuários.
	socket.broadcast.emit('new socket connected', clients);
	
	// Define a sala do chat
	var room = socket.handshake.query.channel;
	
	socket.join(room, () => {
		console.log('Socket id: ' + socket.id + ' joined to room ' + room + '!');
		io.to(room).emit('new socket joined', room, io.sockets.adapter.rooms[room].length);
	});

	/* eventos do socket */

	// Evento disconnect ocorre quando sai um client.
	socket.on('disconnect', function(){
		console.log('Socket id: ' + socket.id + ' disconnected!');
		clients--;
		// Atualiza o total de clients para os demais usuários.
		socket.to(room).broadcast.emit('new socket disconnected', clients);
		//
		//console.log(io.sockets.adapter.rooms);
		var count_room = (io.sockets.adapter.rooms[room] != undefined) ? io.sockets.adapter.rooms[room].length : 0;
		io.to(room).emit('new socket leaved', count_room);
	});

	// Evento do chat
	socket.on('chat message', function(msg){
		console.log('Socket id: ' + socket.id + ' say:' + msg);
		var row = [{'room': room, 'agent': socket.id, 'message': msg}];
		global.conn.insert(row);
		io.to(room).emit('chat message', msg);
	});

	socket.on('chat typing', function(){
		console.log('Socket id: ' + socket.id + ' is typing...');
		socket.to(room).broadcast.emit('chat typing', socket.id);
	});

	//
	global.conn.findAll(room, (err, docs) => {
		console.log('Buscando mensagens da sala ' + room + ' ...');
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
