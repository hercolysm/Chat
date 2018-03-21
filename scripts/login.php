<?php
// constantes
define("HOST", "localhost");
define("USUARIO", "root");
define("SENHA", "");
define("BD", "chat");

$PDO = conectar();
$login = $_POST["login"];
$senha = $_POST["senha"];

$consulta_usuario = $PDO->query("SELECT id_usuario FROM usuarios where login='$login' AND senha=MD5('$senha')");

if ($consulta_usuario->rowCount() == 1) {
	e("Login realizado com sucesso!");
	session_start();
	$_SESSION["id_usuario"] = $consulta_usuario->fetchColumn();
	$_SESSION["login"] = $login;
	$_SESSION["senha"] = md5($senha);
	$_SESSION["sala"] = $_POST["sala"];
	//include "../public/chat.php";
	$redirect = "../public/chat.php";
} else {
	e("Login ou senha incorretos!");
	//include "../public/index.php";
	$redirect = "../public/index.php";
}
header("location:$redirect");

function conectar(){
	try
	{
		e("Conectando ao banco de dados...");
		return new PDO("mysql:host=".HOST.";dbname=".BD."",USUARIO,SENHA);
	}
	catch (PDOException $e)
	{
		e($e->getMessage());
		e($e->getCode());
	}
}

function e($txt){
	echo $txt."\n";
}
