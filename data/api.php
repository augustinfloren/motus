<?php
require 'config.php'; // Inclure les informations de configuration
require 'routes.php'; // Inclure le fichier des routes

// Créer une connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("La connexion a échoué : " . $conn->connect_error);
}

// Obtenir la méthode HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Obtenir l'URI pour déterminer la route
$request = $_SERVER['REQUEST_URI'];
$request_uri = $_SERVER['REQUEST_URI'];
error_log("Requête envoyée : " . $request_uri);
$request = str_replace("/motus/data/api.php", "", $request); // Supprimer '/api.php' de l'URI
// Supprimer également les éventuels paramètres GET
$request = strtok($request, '?');
error_log("Requête transfromée : " . $request);

// Définir les routes
switch ($method) {
    case 'GET':
        if ($request === '/words') {
            getWords($conn);  // Récupérer tous les mots
        } elseif ($request === '/scores') {
            getScores($conn);  // Récupérer tous les scores des joueurs
        }
        break;

    case 'POST':
        if ($request === '/player') {
            // Enregistrer un joueur et les mots qu'il a trouvés
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

// Fermer la connexion
$conn->close();
?>
