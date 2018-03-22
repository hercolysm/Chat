<?php
// constantes
define("HOST", "localhost");
define("USUARIO", "root");
define("SENHA", "");
define("BD", "chat");

$PDO = conectar();
function conectar(){
	try
	{
		return new PDO("mysql:host=".HOST.";dbname=".BD."",USUARIO,SENHA);
	}
	catch (PDOException $e)
	{
		print $e->getMessage();
		print $e->getCode();
	}
}
?>
<html lang="pt-br">
<head>
<title>Chat Local</title>
</head>
<body>
<br>
<form action="../../chat/scripts/login.php" method="POST">
	<input type="hidden" name="acao" value="login">
	<legend>Login</legend>
	<label>Login</label>
	<input type="text" name="login">
	<br>
	<label>Senha</label>
	<input type="password" name="senha">
	<br>
	<label>Sala</label>
	<select name="id_sala" required="required">
		<?php
			foreach ($PDO->query("SELECT id_sala, nome FROM salas")->fetchAll(PDO::FETCH_ASSOC) as $sala) {
				print "<option value=\"".$sala['id_sala']."\">".$sala['nome']."</option>\n";
			}
		?>
	</select>
	<br>
	<button type="submit">Entrar</button>
</form>
</body>
</html>
