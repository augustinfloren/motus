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
        this.score = 0;
    }

    initializeGame() {
        // Création des éléments HTML de la grille du jeu
        let container = this.createDivWithClass("game");
        container.classList.add("class", "border", "border-3", "border-primary", "p-3", "rounded");
        let firstLetter = document.createElement("div");
        firstLetter.classList.add("badge", "bg-primary", "text-white", "text-uppercase");
        let hiddenWord = document.createElement("h2");
        // hiddenWord.classList.add("hidden-word", "text-primary");
        hiddenWord.textContent = `${this.word.charAt(0)} _ _ _ _ _`;
        firstLetter.appendChild(hiddenWord);
        for (let ia = 1; ia < 7; ia++) {
            let wordContainer = this.createDivWithClass(`w-${ia}`);
            wordContainer.classList.add("word-container");
            for (let ib = 1; ib < 7; ib++) {
                let letterContainer = this.createDivWithClass(`lt-${ib}`);
                letterContainer.classList.add("letter-container", "border", "border-primary", "rounded");
                let letter = document.createElement("h3");
                letter.classList.add("letter");
                letterContainer.appendChild(letter);
                wordContainer.appendChild(letterContainer);
            };
            container.appendChild(wordContainer);
        }
        this.container.appendChild(firstLetter);
        return container;
    }

    victory() {
        this.score++;
        const container = this.container.querySelector(".game");
        container.classList.add("replay");
        const title = this.container.querySelector("h2");
        this.container.querySelector(".game-form").remove();
        title.textContent = "Gagné !";
        container.innerHTML = "";
        const score = this.createDivWithClass("score");
        score.textContent = "score :" + this.score;
        score.classList.add("text-primary", "display-3", "text-uppercase");
        const replay = document.createElement("button");
        replay.classList.add("btn", "btn-primary");
        replay.textContent = "Rejouer";
        const save = this.createDivWithClass("save");
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Enregistrer son score";
        saveBtn.classList.add("btn", "btn-secondary")
        const name = document.createElement("input");
        name.setAttribute("placeholder", "Votre nom");
        name.classList.add("form-control", "border-primary");
        save.appendChild(name);
        save.appendChild(saveBtn);
        container.appendChild(score);
        container.appendChild(replay);
        container.appendChild(save);
    }

    defeat() {
        
    }

    submitWord(event) {
        event.target.setAttribute("disabled", "true");
        const lettersContainer = this.game.querySelector(`.w-${this.round}`);
        const secret = Array.from(this.word).map((letter, index) => ({ letter, index, "checked" : false }));
        const attempt = Array.from(event.target.parentNode.querySelector("input").value);
        const input = event.target.parentNode.querySelector("input");
        input.value = "";
        for (let i = 0; i < lettersContainer.children.length; i++) {
            // Lettre tentée
            const attemptLetter = attempt[i];
            // Case 
            const container = lettersContainer.children[i].children[0];
            container.textContent = attemptLetter;
            // Cherche occurence pour chaque lettre et vérifie si déjà regardée
            const match = secret.find (el => el.letter === attemptLetter && !el.checked);
            // Case de la lettre correspondante à la position de la lettre trouvée
            const letter = lettersContainer.children[i];
            if (match) {
                // Lettre secrète correspondante à la position de la lettre essayée
                const secretLetter = secret[i];
                // Si bonne position et pas déjà regardée
                if (match.letter === secretLetter.letter && !match.position) {
                    // Marque la lettre
                    secret[match.index].checked = true;
                    secret[match.index].position = true;
                    letter.classList.remove("border-primary");
                    letter.classList.add("bg-danger", "text-white", "border-danger");
                // Si mauvaise position
                } else {
                    secret[match.index].checked = true;
                    letter.classList.remove("border-primary");
                    letter.classList.add("bg-warning", "text-dark", "border-warning");
                }
            } else {
                letter.classList.add("text-white");
            }
        }
        // Vérification du mot entier
        let correctLetters = secret.filter((letter) => letter.position);
        if (correctLetters.length === 6) {
            this.victory();
        } else if (this.round === 6) {
            this.defeat();
        }
        this.round++;
    }

    checkInput(event) {
        const value = event.target.value;
        const regex = "^[a-zA-Z]{6}$";
        const btn = event.target.parentNode.querySelector("button");
        if (value.match(regex)) {
            btn.removeAttribute('disabled');
        } else {
            btn.setAttribute("disabled", true);
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
        input.classList.add("form-control", "border-primary", "bg-transparent", "text-white");
        let button = document.createElement("button");
        button.classList.add("btn", "btn-primary");
        button.setAttribute("disabled", true);
        button.textContent = "Envoyer";
        button.addEventListener("click", this.submitWord.bind(this));
        input.addEventListener("keyup", this.checkInput.bind(this));
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

