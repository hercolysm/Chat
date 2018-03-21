<?php
// constantes
define("HOST", "localhost");
define("USUARIO", "root");
define("SENHA", "");
define("BD", "chat");

$PDO = null;
$Redis = null;

notificar();

function notificar(){
	global $PDO;
	global $Redis;
	if (!$PDO) {
		$PDO = conectar();
	}
	if ($PDO) {
		$notificacoes = buscar_notificacoes();
		if (!$Redis) {
			e("Conectando ao servidor redis...");
			$Redis = new Redis();
			$Redis->connect("127.0.0.1", 6379);
		}
		if ($Redis) {
			if (is_array($notificacoes)) {
				e("Publicando notificacoes...");
				foreach ($notificacoes as $channel => $value) {
					$Redis->publish($channel, $value);
				}
			}
		}
	}

	sleep(5);
	notificar();
}

function conectar(){
	global $PDO;
	try
	{
		e("Conectando ao banco de dados...");
		$PDO = new PDO("mysql:host=".HOST.";dbname=".BD."",USUARIO,SENHA);
	}
	catch (PDOException $e)
	{
		e($e->getMessage());
		e($e->getCode());
	}
	return $PDO;
}

function e($txt){
	echo $txt."\n";
}

function buscar_notificacoes(){
	global $PDO;
	e("Buscando por notificações..");
	//$total_usuarios = $PDO->query("SELECT COUNT(id_usuario) FROM usuarios")->fetchColumn();
	$total_mensagens = $PDO->query("SELECT id_sala, COUNT(id_mensagem) as total FROM mensagens GROUP BY id_sala");
	$salas = array();
	while ($row = $total_mensagens->fetch(PDO::FETCH_ASSOC)) {
		$id_sala = $row["id_sala"];
		$total_mensagens = $row["total"];
		array_push($salas, array("id_sala"=>$id_sala, "total"=>$total));
	}
	return $salas;
}