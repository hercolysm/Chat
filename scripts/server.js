// Servidor: index.js

// Iniciando servidor HTTP
const app = require('http').createServer(index);
const io = require('socket.io').listen(app);
const fs = require('fs');
const port = 3000;

// Iniciando redis client
var redis = require('redis');
var redis_cli = redis.createClient();

// Iniciando banco mongoDB
global.conn = require('./db');

var chat = [];

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

	redis_cli.subscribe(room);

	/* eventos do socket */

	// Evento disconnect ocorre quando sai um client
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


// if you'd like to select database 3, instead of 0 (default), call
// redis_cli.select(3, function() { /* ... */ });

redis_cli.on('connect', () => {
	console.log("Connected with Redis success!");
});

redis_cli.on('reconnecting', () => {
	console.log("Reconnecting with Redis...");
});

redis_cli.on("error", (err) => {
    console.log("Failed to connect to Redis: " + err);
});

redis_cli.on('ready', () => {
	console.log("Redis Client is ready!");
});

redis_cli.on('end', () => {
	console.log("Connection with Redis closed!");
});

redis_cli.set("string_key", "string val");

redis_cli.get('string_key', (err, reply) => {
	if (reply) {
		console.log(reply.toString());
	}
});

// redis_cli.subscribe('notificacoes');

redis_cli.on('subscribe', (channel, count) => {
	console.log('listening channel "'+ channel + '('+ count +')' +'"...');
});

redis_cli.on('message', function(channel, message){
	console.log('new message received! sending to clients');
	io.to(channel).emit('notificacoes', message);
});

/*
var sub = redis.createClient(), pub = redis.createClient();

sub.on("subscribe", function (channel, count) {
    pub.publish("a nice channel", "I am sending a message.");
    pub.publish("a nice channel", "I am sending a second message.");
    pub.publish("a nice channel", "I am sending my last message.");
});

sub.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
});

sub.subscribe("a nice channel");

redis_cli.quit(); // encerra de forma limpa
redis_cli.end(true); // encerra violentamente
/*
redis_cli.hset("hash_key", "hashtest_1", "some value", redis.print);
redis_cli.hset(["hash_key", "hashtest_2", "some other value"], redis.print);
redis_cli.hkeys("hash_key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    redis_cli.quit();
});

/*

*/