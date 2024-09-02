class Game {
    /**
     * @param {HTMLElement} element
     * @param {string} word
     */
    constructor(element, word) {
        this.element = element;
        this.word = word;
        this.container = this.createDivWithClass("game-container");
        this.game = this.initializeGame();
        this.form = this.createForm();
        this.container.appendChild(this.game);
        this.container.appendChild(this.form);
        this.element.appendChild(this.container);
        this.round = 1;
    }

    initializeGame() {
        let container = this.createDivWithClass("game");
        let hiddenWord = document.createElement("h2");
        hiddenWord.setAttribute("class", "hidden-word");
        hiddenWord.textContent = `${this.word.charAt(0)} _ _ _ _ _`;
        // Création éléments HTML de la grille
        for (let ia = 1; ia < 7; ia++) {
            let wordContainer = this.createDivWithClass(`w-${ia}`);
            wordContainer.classList.add("word-container");
            for (let ib = 1; ib < 7; ib++) {
                let letterContainer = this.createDivWithClass(`lt-${ib}`);
                letterContainer.classList.add("letter-container");
                let letter = document.createElement("h3");
                letter.classList.add("letter");
                letterContainer.appendChild(letter);
                wordContainer.appendChild(letterContainer);
            };
            container.appendChild(wordContainer);
        }
        this.container.appendChild(hiddenWord);
        return container;
    }

    submitWord(event) {
        // Récupération de la grille du round en cours
        const lettersContainer = this.game.querySelector(`.w-${this.round}`);
        // Création tableau d'objet du mot secret > objet avec trois données
        const secretWord = Array.from(this.word).map((letter, index) => ({ letter, index, "position" : false }));
        // Création du tableau d'objet du mot essayé
        const attempt = Array.from(event.target.parentNode.querySelector("input").value).map((letter, index) => ({ letter, index, "position" : false }));
        console.log(this.word)
        
        // Boucle sur les cases de la lignes
        for (let i = 0; i < lettersContainer.children.length; i++) {
            // Lettre essayée
            const attemptLetter = attempt[i].letter;
            // Lettre secrète correspondante
            const secretLetter = secretWord[i].letter;
            // case correspondante à la position de la lettre 
            const container = lettersContainer.children[i];
            // Remplissage des cases avec les lettres
            container.textContent = attemptLetter;
            // Tableau contenant les occurences 
            // où la position n'est pas indiquée
            const match = secretWord.find (el => el.letter === attemptLetter && !el.position);
            console.log(match)
            // A partir de cet objet renvoyé, marquer les objets position correpondants
            // du tableau du mot secret 
            if (match) {
                // case correspondante à la position de la lettre trouvée
                const container = lettersContainer.children[i];
                // Lettre secrète correspondante à la position de la lettre essayée
                const secretLetter = secretWord[i];
                // Si les lettres correspondent, et que la position 
                // n'est pas déjà indiquée alors position ok
                if (match.letter === secretLetter.letter && !attempt[match.index].position) {
                    // Lettre d'essai correspondant au match
                    attempt[match.index].position = "correct";
                    // Lettre secrete correspondant au match
                    secretWord[match.index].position = "correct";
                    // Remplir la case correspondante 
                    container.classList.add("correct");
                // Si les lettres ne correspondent pas, et que la position 
                // n'est pas déjà indiquée alors position wrong
                } else if (match.letter !== secretLetter.letter && !attempt[match.index].position) {
                    // Lettre d'essai correspondant au match
                    attempt[match.index].position = "wrong";
                    // Lettre secrete correspondant au match
                    secretWord[match.index].position = "correct";
                    container.classList.add("wrong");
                }
            }
        }
        console.log(attempt)

        if (this.round === 6) {
            console.log("end")
        } else {
            this.round++;
        }
    }
    
    createForm() {
        let container = this.createDivWithClass("game-form");
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", "word");
        input.setAttribute("name", "word");
        input.setAttribute("required", "");
        input.setAttribute("minlength", "6");
        input.setAttribute("maxlength", "6");
        let button = document.createElement("button");
        button.textContent = "Envoyer";
        button.addEventListener("click", this.submitWord.bind(this));
        container.appendChild(input);
        container.appendChild(button);
        return container;
    }
    
    createDivWithClass(className) {
        let div = document.createElement("div");
        div.setAttribute("class", className);
        return div;
    }
}

function onReady() {
    const section = document.getElementById("game");

    fetch("./mots.json") 
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des données');
            }
            return response.json();
        })
        .then(words => {
            let randomWord = words[Math.floor(Math.random() * words.length)];

            if (section) {
                new Game(section, randomWord.mot);
            }
        })
        .catch(error => {
            console.error("Erreur lors du chargement des données : " + error);
        })

}

document.addEventListener("DOMContentLoaded", onReady);

