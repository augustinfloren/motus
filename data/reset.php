<?php
require 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("La connexion a échoué : " . $conn->connect_error);
}

$conn->query("SET FOREIGN_KEY_CHECKS = 0");

$result = $conn->query("SHOW TABLES");

if ($result) {
    while ($row = $result->fetch_array()) {
        $tableName = $row[0];
        $conn->query("DROP TABLE IF EXISTS $tableName");
        echo "Table '$tableName' supprimée avec succès<br>";
    }
} else {
    echo "Erreur lors de la récupération des tables : " . $conn->error . "<br>";
}

$conn->query("SET FOREIGN_KEY_CHECKS = 1");

$conn->close();

echo "Toutes les tables ont été supprimées avec succès, la base de données est vide.";
?>
