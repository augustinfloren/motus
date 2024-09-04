<?php
require 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("La connexion a échoué : " . $conn->connect_error);
}

$jsonFile = 'mots.json'; 
$jsonData = file_get_contents($jsonFile);

$wordsArray = json_decode($jsonData, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    die("Erreur lors du décodage du fichier JSON : " . json_last_error_msg());
}

$stmt = $conn->prepare("INSERT INTO word (word) VALUES (?)");

if ($stmt === false) {
    die("Erreur lors de la préparation de la requête : " . $conn->error);
}

$stmt->bind_param("s", $word);

foreach ($wordsArray as $entry) {
    $word = $entry['mot'];
    if ($stmt->execute()) {
        echo "Mot '$word' inséré avec succès.<br>";
    } else {
        echo "Erreur lors de l'insertion du mot '$word' : " . $stmt->error . "<br>";
    }
}

$stmt->close();
$conn->close();
?>
