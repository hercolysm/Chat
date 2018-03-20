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
			e("Publicando notificacoes...");
			$Redis->publish("a nice channel", $notificacoes.rand(0,100));
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
	return e("Buscando por notificações..");
	$total_usuarios = $PDO->query("SELECT COUNT(id_usuario) FROM usuarios")->fetchColumn();
}