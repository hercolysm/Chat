<html lang="pt-br">
<head>
<title>Chat Local</title>

<!-- scripts -->
<script src="assets/js/jquery-3.1.1.min.js"></script>
<script src="assets/js/socket.io.js"></script>

<!-- style -->
<style type="text/css">
	* { margin: 0; padding: 0; box-sizing: border-box; }
	body { font: 13px Helvetica, Arial; }
	form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
	form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
	form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
	#messages { list-style-type: none; margin: 0; padding: 0; }
	#messages li { padding: 5px 10px; }
	#messages li:nth-child(odd) { background: #eee; }
	#div_notificacoes { position: fixed; top: 5px; right: 50px; }
</style>
</head>
<body>
<div id="div_notificacoes">
	<ul id="notificacoes">
		<li>Notificação 01</li>
	</ul>
</div>
<br>
<center>Chat Local com Socket.io</center>
<div id="conectado" class="hide">
	<p>Status: Conectado!</p>
	<p>Sala: <span id="sala_atual">-</span><br> Usuários Online: <span id="sala_clients">0</span></p>
</div>
<div id="desconectado" class="hide">
	<p>Status: Desconectado!</p>
</div>
<ul id="messages"></ul>
<div id="client_typing"></div>
<br>
<br>
<br>
<br>
<br>
<form action="">
<input id="m" autocomplete="off"><button>Enviar</button>
</form>

<script>
$(function(){
	const origin = location.origin;
	const port = '3000';
	const room = Math.floor( (Math.random() * 2) + 1) ;

	const socket = io(origin +':'+ port, {
		query: {
			channel: room
		}
	});

	socket.on('connect', () => {
		console.log('Conectado ao socket com sucesso! Id: ' + socket.id);
		conectado();
	});

	socket.on('connect_error', (erro) => {
		console.log('Falha ao conectar ao socket');
		console.log(erro);
		desconectado();
	});

	socket.on('error', (erro) => {
		console.log('Erro no socket ocorreu!');
		console.log(erro);
		desconectado();
	});

	socket.on('new socket connected', function(clients){
		//document.getElementById('clients').innerHTML = clients;
	});

	socket.on('new socket disconnected', function(clients){
		//document.getElementById('clients').innerHTML = clients;
	});

	socket.on('new socket joined', function(sala, clients){
		document.getElementById('sala_atual').innerHTML = sala;
		document.getElementById('sala_clients').innerHTML = clients;
	});

	socket.on('new socket leaved', function(clients){
		document.getElementById('sala_clients').innerHTML = clients;
	});

	socket.on('chat message', function(msg){
		$('#client_typing').html('');
		$('#messages').append($('<li>').text(msg));
	});

	socket.on('chat typing', function(client){
		console.log(client + 'está digitando...');
		$('#client_typing').html('<span>'+ client +'</span> esta digitando...');
		$('#client_typing').fadeIn(500).delay(2000).fadeOut(250);
	});

	socket.on('chat', function(chat){
		$('#messages').html('');
		$.each(chat, function(i, row){
			$('#messages').append($('<li>').text(row.message));
		});
	});

	socket.on('notification', function(notifications){
		$.each(notifications, function(i, row){
			console.log(i);
			console.log(row);
		})
	});


	$('form').submit(function(){
		socket.emit('chat message', $('#m').val());
		$('#m').val('');
		return false;
	});

	$('#m').keyup(function(){
		socket.emit('chat typing');
	});

	/* funções */
	function conectado() {
		$('#desconectado').hide();
		$('#conectado').show();
	}

	function desconectado() {
		$('#conectado').hide();
		$('#desconectado').show();
	}
});
</script>
</body>
</html>
