<?php
require 'config.php';

$servername = "localhost";
$username = "root";
$password = "Trappist13!"; 
$dbname = "motus";

$conn = new mysqli($servername, $username, $password);

if ($conn->connect_error) {
    die("La connexion a échoué: " . $conn->connect_error);
}

$sql = "CREATE DATABASE $dbname";
if ($conn->query($sql) === TRUE) {
    echo "Base de données créée avec succès";
} else {
    echo "Erreur lors de la création de la base de données: " . $conn->error;
}

$conn->close();
?>
