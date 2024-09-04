<?php
require 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("La connexion a échoué : " . $conn->connect_error);
}
echo "Connexion réussie !<br>";

// Mot
$sql = "CREATE TABLE IF NOT EXISTS word (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(255) NOT NULL
)";

if ($conn->query($sql) === TRUE) {
    echo "Table 'mot' créée avec succès<br>";
} else {
    echo "Erreur lors de la création de la table 'mot' : " . $conn->error . "<br>";
}

// Joueur
$sql = "CREATE TABLE IF NOT EXISTS player (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    score_id INT NOT NULL
)";

if ($conn->query($sql) === TRUE) {
    echo "Table 'joueur' créée avec succès<br>";
} else {
    echo "Erreur lors de la création de la table 'joueur' : " . $conn->error . "<br>";
}

// Mots trouvés
$sql = "CREATE TABLE IF NOT EXISTS found_word (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word_id INT NOT NULL,
    player_id INT NOT NULL,
    FOREIGN KEY (word_id) REFERENCES word(id),
    FOREIGN KEY (player_id) REFERENCES player(id)
)";

if ($conn->query($sql) === TRUE) {
    echo "Table 'founded_word' créée avec succès<br>";
} else {
    echo "Erreur lors de la création de la table 'founded_word' : " . $conn->error . "<br>";
}

$conn->close();
?>
