<?php
// constantes
define("HOST", "localhost");
define("USUARIO", "root");
define("SENHA", "");
define("BD", "chat");

$PDO = conectar();

switch ($_REQUEST['acao']) {
	case 'login':
		login();
		break;
	
	case 'logout':
		logout();
		break;
}

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


function login(){
	global $PDO;
	$login = $_POST["login"];
	$senha = $_POST["senha"];
	$id_sala = $_POST["id_sala"];

	$consulta_usuario = $PDO->query("SELECT id_usuario FROM usuarios where login='$login' AND senha=MD5('$senha')");

	if ($consulta_usuario->rowCount() == 1) {
		e("Login realizado com sucesso!");
		$id_usuario = $consulta_usuario->fetchColumn();
		
		$stmt = $PDO->prepare("INSERT INTO usuarios_online (id_usuario, id_sala, data_entrada) VALUES ($id_usuario, $id_sala, CURRENT_TIMESTAMP)");
		$retorno = $stmt->execute([':id_usuario'=>$id_usuario, ':id_sala'=>$id_sala]);
		
		if ($retorno == true) {
			session_start();
			$_SESSION["id_usuario"] = $id_usuario;
			$_SESSION["login"] = $login;
			$_SESSION["senha"] = md5($senha);
			$_SESSION["id_sala"] = $id_sala;
			
			$redirect = "../public/chat.php";
		} else {
			e("Erro ao realizar login!");
			$redirect = "../public/index.php";
		}
		
	} else {
		e("Login ou senha incorretos!");
		//include "../public/index.php";
		$redirect = "../public/index.php";
	}
	header("location:$redirect");

}

function logout(){
	global $PDO;
	session_start();
	$q = $PDO->query("UPDATE usuarios_online SET data_saida=NOW() WHERE id_usuario='".$_SESSION['id_usuario']."'");

	unset($_SESSION["id_usuario"]);
	unset($_SESSION["login"]);
	unset($_SESSION["senha"]);
	session_destroy();

	$redirect = "../public/index.php";
	header("location:$redirect");
}