<?php

session_start();
unset($_SESSION["id_usuario"]);
unset($_SESSION["login"]);
unset($_SESSION["senha"]);
session_destroy();

$redirect = "../public/index.php";
header("location:$redirect");
