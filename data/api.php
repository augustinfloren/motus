<?php
header('Content-Type: application/json');
require 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500); 
    echo json_encode(['error' => 'La connexion à la base de données a échoué.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT word FROM word"; 

    $result = $conn->query($sql);

    if ($result) {
        $words = [];
        while ($row = $result->fetch_assoc()) {
            $words[] = $row['word'];
        }
        
        echo json_encode($words);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de l\'exécution de la requête.']);
    }
} else {
    http_response_code(405); 
    echo json_encode(['error' => 'Méthode HTTP non autorisée.']);
}

$conn->close();
?>
