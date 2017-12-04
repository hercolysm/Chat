// Servidor: index.js

// Iniciando servidor HTTP
const app = require('http').createServer(index);
const io = require('socket.io').listen(app);
const fs = require('fs');

function index(req, res){
	fs.readFile(__dirname + '/index.html', function(err, data){
		res.writeHead(200);
		res.end(data);
	});
};

app.listen(3000, function() {
	console.log("Servidor rodando!");
});

// Iniciando Socket.IO
var visitas = 0;

// Evento connection ocorre quando entra um novo usuário.
io.on('connection', function(socket){
	console.log('Um usuario conectou!');
	// Incrementa o total de visitas no site.
	visitas++;
	// Envia o total de visitas para o novo usuário.
	socket.emit('visits', visitas);
	// Envia o total de visitas para os demais usuários.
	socket.broadcast.emit('visits', visitas);
	// Evento disconnect ocorre quando sai um usuário.
	socket.on('disconnect', function(){
		console.log('Um usuario desconectou!');
		visitas--;
		// Atualiza o total de visitas para os demais usuários.
		socket.broadcast.emit('visits', visitas);
	});
	//
	socket.on('chat message', function(msg){
		console.log('Nova messagem recebida: ' + msg);
		io.emit('chat message', msg);
	});
});
