<?php
$usuario = "mecardenal";
$contrasena = "pitidiasis";  // en mi caso tengo contraseña pero en casa caso introducidla aquí.
$servidor = "192.168.1.146";
$basededatos = "ML_test";
	
$conexion = mysqli_connect( $servidor, $usuario, $contrasena) or die ("No se ha podido conectar al servidor de Base de datos");;


?>