<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Motus</title>
        <link rel="stylesheet" href="motus.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    </head>
    <body>
        <div id="container" class="bg-dark">
            <header class="bg-primary">
                <h1 class="text-white display-2">Motus</h1>
                <nav>
                    <a href="/motus/motus.php" class="scores-link btn btn-secondary text-light">Nouveau jeu</a>
                </nav>
            </header>
            <section id="scores">
                <h2 class="display-2 text-secondary">Scores</h2>
                <?php
                
                $apiUrl = 'http://localhost/motus/data/api.php/scores'; 

                $ch = curl_init();

                curl_setopt($ch, CURLOPT_URL, $apiUrl);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPGET, true);

                $response = curl_exec($ch);

                if (curl_errno($ch)) {
                    echo 'Erreur cURL : ' . curl_error($ch);
                    curl_close($ch);
                    exit;
                }

                curl_close($ch);

                $data = json_decode($response, true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                    echo 'Erreur de décodage JSON : ' . json_last_error_msg();
                    exit;
                }

                // Fonction de comparaison pour trier par score décroissant
                function compareScores($a, $b) {
                    if ($a['score'] == $b['score']) {
                        return 0;
                    }
                    return ($a['score'] > $b['score']) ? -1 : 1;
                }

                // Trier les données
                usort($data, 'compareScores');
                
                foreach ($data as $player) {
                    echo '<h3 class="fs-1 text-light">' . htmlspecialchars($player['name']) . " : " . htmlspecialchars($player['score']) . '</h3>';
                }                

                ?>
            </section>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            <footer></footer>
        </div>
    </body>
</html>