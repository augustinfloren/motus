class Game {
    /**
     * @param {HTMLElement} element
     * @param {string} word
     */
    constructor(element, words) {
        this.test = 1;
        this.round = 1;
        this.score = 0;
        this.newGame = false;
        this.element = element;
        this.word = "";
        this.words = words;
        this.container = this.createDivWithClass("game-container");
        this.gameBoard = this.initializeGame();
        this.form = this.createForm();
        this.modal = this.createModal();
        this.container.appendChild(this.gameBoard);
        this.container.appendChild(this.form);
        this.container.appendChild(this.modal);
        this.element.appendChild(this.container);
    };

    generateWord() {
        this.words.sort(() => Math.random() - 0.5);
    };

    initializeGame() {
        this.generateWord();
        this.word = this.words[this.round-1].mot;

        // Création des éléments HTML de la grille du jeu
        let container = this.createDivWithClass("game-board");
        container.classList.add("class", "border", "border-3", "border-primary", "p-3", "rounded");

        const round = document.createElement("h2");
        round.classList.add("round", "text-light", "text-uppercase");
        round.textContent = `Mot ${this.round} / ${this.words.length}`;

        const hiddenWord = document.createElement("div");
        hiddenWord.classList.add("badge", "bg-primary", "text-white", "text-uppercase");

        const hiddenLetter = document.createElement("h2");
        hiddenLetter.classList.add("hidden-letter");
        hiddenLetter.textContent = `${this.word.charAt(0)} _ _ _ _ _`;

        hiddenWord.appendChild(hiddenLetter);

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
        this.container.appendChild(round);
        this.container.appendChild(hiddenWord);
        return container;
    };

    resetGame() {
        this.test = 1;

        if (this.newGame) {
            this.generateWord();
            this.newGame = false;
            this.score = 0;
            this.round = 1;
        } else {
            this.round++;
        }

        this.word = this.words[this.round - 1].mot;

        const nextBtn = this.container.querySelector(".next-btn");
        nextBtn.remove();

        const form = this.form;
        form.querySelector("input").style.display = "flex";   
        form.querySelector("button").style.display = "flex";

        const round = this.container.querySelector(".round");
        round.textContent = `Mot ${this.round} / ${this.words.length}`;

        const hiddenLetter = this.container.querySelector(".hidden-letter");
        hiddenLetter.textContent = `${this.word.charAt(0)} _ _ _ _ _`;

        const letterContainers = this.gameBoard.querySelectorAll(".letter-container");
        letterContainers.forEach((container) => {
            container.classList.remove(...container.classList);
            container.classList.add("letter-container", "border", "border-primary", "rounded");
            container.firstChild.textContent = "";
        });
    };

    createModal() {
        const container = document.getElementById("container");

        const modal = this.createDivWithClass("end-modal");
        modal.classList.add("modal");

        const title = document.createElement("h2");
        title.classList.add("display-2", "text-light");

        const score = this.createDivWithClass("score");
        score.classList.add("text-primary", "display-3", "text-uppercase");

        const replayBtn = document.createElement("button");
        replayBtn.classList.add("btn", "btn-primary");
        replayBtn.textContent = "Rejouer";
        replayBtn.addEventListener("click", () => {
            modal.style.display = "none";
            this.resetGame();
        });

        const save = this.createDivWithClass("save");
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Enregistrer son score";
        saveBtn.classList.add("btn", "btn-secondary")
        saveBtn.setAttribute("disabled", true);

        const name = document.createElement("input");
        name.setAttribute("placeholder", "Votre nom");
        name.classList.add("form-control", "border-primary");

        save.appendChild(name);
        save.appendChild(saveBtn);

        modal.appendChild(title);
        modal.appendChild(score);
        modal.appendChild(replayBtn);
        modal.appendChild(save);

        return modal;
    };

    endGame() {
        this.newGame = true;
        this.modal.querySelector("h2").textContent = "Partie terminée";
        this.modal.querySelector(".score").textContent = "score : " + this.score;
        this.modal.querySelector(".save").style.display = this.score > 0 ? "flex" : "none";
        this.modal.style.display = "flex";
    };

    endRound(victory) {
        if (this.round === 7) {
            this.endGame();
        }
        const hiddenLetter = this.container.querySelector(".hidden-letter");
        hiddenLetter.textContent = victory ? "Gagné !" : "Perdu !";
        const form = this.form;
        form.querySelector("input").style.display = "none";   
        form.querySelector("button").style.display = "none";

        const button = document.createElement("button");
        button.classList.add("next-btn" ,"btn", "btn-primary");
        button.textContent = "Mot suivant";
        button.addEventListener("click", this.resetGame.bind(this));

        form.appendChild(button);
    };

    submitWord(event) {
        event.target.setAttribute("disabled", "true");
        const lettersContainer = this.gameBoard.querySelector(`.w-${this.test}`);
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
            };
        };
        // Vérification du mot entier
        let correctLetters = secret.filter((letter) => letter.position);

        if (correctLetters.length === 6) {
            let victory = true;
            this.score++;
            this.endRound(victory);
        } else if (this.test === 6) {
            this.endRound();
        };

        this.test++;
    };

    checkInput(event) {
        const value = event.target.value;
        const regex = "^[a-zA-Z]{6}$";
        const btn = event.target.parentNode.querySelector("button");

        if (value.match(regex)) {
            btn.removeAttribute('disabled');
        } else {
            btn.setAttribute("disabled", true);
        }
    };
    
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
    };
    
    createDivWithClass(className) {
        let div = document.createElement("div");
        div.setAttribute("class", className);
        return div;
    };
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
            if (section) {
                new Game(section, words);
            }
        })
        .catch(error => {
            console.error("Erreur lors du chargement du jeu : " + error);
        })
}

document.addEventListener("DOMContentLoaded", onReady);

