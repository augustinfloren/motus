<?php
require 'config.php';

// Créer la connexion
$conn = new mysqli($servername, $username, $password);

// Vérifier la connexion
if ($conn->connect_error) {
    die("La connexion a échoué: " . $conn->connect_error);
}

// Créer la base de données
$sql = "CREATE DATABASE motus";
if ($conn->query($sql) === TRUE) {
    echo "Base de données créée avec succès";
} else {
    echo "Erreur lors de la création de la base de données: " . $conn->error;
}

// Fermer la connexion
$conn->close();
?>
