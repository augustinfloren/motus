<?php
require 'config.php'; 
require 'routes.php'; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("La connexion a échoué : " . $conn->connect_error);
}

$method = $_SERVER['REQUEST_METHOD'];

$request = $_SERVER['REQUEST_URI'];
$request_uri = $_SERVER['REQUEST_URI'];
$request = str_replace("/motus/data/api.php", "", $request); 
$request = strtok($request, '?');

// Routes
switch ($method) {
    case 'GET':
        if ($request === '/words') {
            getWords($conn); 
        } elseif ($request === '/scores') {
            getScores($conn);  
        }
        break;

    case 'POST':
        if ($request === '/player') {
            // Enregistrer un joueur et les mots qu'il a trouvés
            $raw_input = file_get_contents('php://input');
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['name']) && isset($data['words'])) {
                savePlayerAndWords($conn, $data['name'], $data['words']);
            } else {
                echo json_encode(["status" => "error", "message" => "Données manquantes."]);
            }
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Méthode HTTP non autorisée."]);
        break;
}

$conn->close();
?>
