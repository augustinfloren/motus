<?php

// Récupérer tous les mots
function getWords($conn) {
    header('Content-Type: application/json');

    $sql = "SELECT word FROM word";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $words = [];
        while ($row = $result->fetch_assoc()) {
            $words[] = $row['word'];
        }
        echo json_encode($words);
    } else {
        echo json_encode([]);
    }
}

// Enregistrer un joueur et les mots qu'il a trouvés
function savePlayerAndWords($conn, $playerName, $words) {
    // Insérer le joueur
    $stmt = $conn->prepare("INSERT INTO player (name) VALUES (?)");
    $stmt->bind_param("s", $playerName);

    if ($stmt->execute()) {
        $playerId = $stmt->insert_id;  // ID du joueur nouvellement inséré

        // Parcourir chaque mot trouvé et l'enregistrer
        foreach ($words as $word) {
            // Vérifier si le mot existe dans la table `word`
            $stmt = $conn->prepare("SELECT id FROM word WHERE word = ?");
            $stmt->bind_param("s", $word);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $wordId = $row['id'];
            } else {
                // Insérer le mot si non existant
                $stmt = $conn->prepare("INSERT INTO word (word) VALUES (?)");
                $stmt->bind_param("s", $word);
                $stmt->execute();
                $wordId = $stmt->insert_id;
            }

            // Insérer le mot trouvé dans la table `founded_word`
            $stmt = $conn->prepare("INSERT INTO founded_word (word_id, player_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $wordId, $playerId);
            $stmt->execute();
        }

        echo json_encode(["status" => "success", "message" => "Joueur et mots enregistrés avec succès!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erreur lors de l'enregistrement du joueur."]);
    }
}

// Récupérer les scores des joueurs
function getScores($conn) {
    header('Content-Type: application/json');

    $sql = "SELECT p.name, COUNT(f.word_id) as score
            FROM player p
            JOIN founded_word f ON p.id = f.player_id
            GROUP BY p.id";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $scores = [];
        while ($row = $result->fetch_assoc()) {
            $scores[] = ["name" => $row['name'], "score" => $row['score']];
        }
        echo json_encode($scores);
    } else {
        echo json_encode([]);
    }
}
?>
