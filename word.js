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
        this.foundWords = [];
        this.container = this.createDivWithClass("game-container");
        this.gameBoard = this.initializeGame();
        this.form = this.createForm();
        this.modal = this.createModal();
        this.container.appendChild(this.gameBoard);
        this.container.appendChild(this.form);
        this.container.appendChild(this.modal);
        this.element.appendChild(this.container);
    };

    /**
     * Tri alétoirement le tableau des mots
     */
    randomizeWords() {
        this.words.sort(() => Math.random() - 0.5);
    };
    
    /**
     * @returns {HTMLElement}
     */
    initializeGame() {
        this.foundWords = [];
        this.score = 0;
        this.randomizeWords();
        this.word = this.words[this.round-1];

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
                letterContainer.classList.add("letter-container", "border", "border-primary", "rounded", "text-white");

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

    /**
     * Réinitialise le jeu et le score selon le cas
     */
    resetGame() {
        if (this.round === 1) {
            this.foundWords = [];
            this.randomizeWords();
            this.score = 0;
        }
        this.test = 1;

        this.word = this.words[this.round - 1];

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
            container.classList.add("letter-container", "border", "border-primary", "rounded", "text-light");
            container.firstChild.textContent = "";
        });
    };

    async submitScore() {
        const name = document.getElementById('name');

        const response = await fetch('./data/api.php/player', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name.value,
                words: this.foundWords
            })
        });
        
        const result = await response.json();
        name.value = '';
        this.modal.style.display = "none";
        this.resetGame();
        alert(result.message);
    }

    /**
     * Ajoute la modale de fin de partie dans le DOM
     * @returns {HTMLElement}
     */
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
        saveBtn.classList.add("btn", "btn-secondary");
        saveBtn.setAttribute("disabled", true);
        saveBtn.addEventListener("click", this.submitScore.bind(this));

        const name = document.createElement("input");
        name.setAttribute("placeholder", "Votre nom");
        name.classList.add("form-control", "border-primary");
        name.id = "name";

        const regex = "^[A-Za-zÀ-ÿà-ÿ\-'\s]{1,20}$";
        name.addEventListener("keyup", (event)=> {
            this.checkInput(event, saveBtn, regex);
        });

        save.appendChild(name);
        save.appendChild(saveBtn);

        modal.appendChild(title);
        modal.appendChild(score);
        modal.appendChild(replayBtn);
        modal.appendChild(save);

        return modal;
    };

    /**
     * Ouvre la modale de fin de partie et affiche le score
     */
    endGame() {
        this.round = 1;
        this.modal.querySelector("h2").textContent = "Partie terminée";
        this.modal.querySelector(".score").textContent = "score : " + this.score;
        this.modal.querySelector(".save").style.display = this.score > 0 ? "flex" : "none";
        this.modal.style.display = "flex";
    };

    /**
     * Gère la fin d'une manche
     * @param {boolean} victory 
     */
    endRound(victory) {
        this.round++;
        if (this.round === this.words.length + 1) {
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

    /**
     * Vérification du mot essayé 
     */
    submitWord(event) {
        this.form.querySelector("button").setAttribute("disabled", "true");
        const lettersContainer = this.gameBoard.querySelector(`.w-${this.test}`);
        const secret = Array.from(this.word).map((letter, index) => ({ letter, index }));
        const attempt = Array.from(event.target.parentNode.querySelector("input").value).map((letter, index) => ({ letter, index }));
        const input = this.form.querySelector("input");
        input.value = "";

        // Lettres bien placée
        const match = secret.filter((el, index) =>
            attempt[index].letter === el.letter
        );
        if (match.length > 0) {
            match.forEach((el) => {
                // Marquage des lettres dans les deux tableaux
                attempt[el.index].check = true;
                secret[el.index].check = true;
                secret[el.index].position = true;
                // Cases justes
                lettersContainer.children[el.index].classList.remove("border-primary");
                lettersContainer.children[el.index].classList.add("border-danger", "bg-danger", "text-white");
            });
        };
        
        attempt.forEach((el, i) => {
            // Remplissage des cases
            lettersContainer.children[i].children[0].textContent = el.letter;
            // Lettre mal placée
            const wrongPos = secret.find(el2 => el2.letter === el.letter && el2.index !== el.index && !el2.check && !el.check);
            
            if (wrongPos) {
                // Marquage de la lettre
                secret[wrongPos.index].check = true;
                // Cases fausses
                lettersContainer.children[i].classList.remove("border-primary");
                lettersContainer.children[i].classList.add("border-warning", "bg-warning", "text-dark");
            }
        })

        let correctLetters = secret.filter((letter) => letter.position);
        
        if (correctLetters.length === 6) {
            let victory = true;
            this.score++;
            this.foundWords.push(this.word);
            this.endRound(victory);
        } else if (this.test === 6) {
            this.endRound();
        };

        this.test++;
    };

    /**
     * 
     * @param {event} event 
     */
    checkInput(event, button, regex) {
        const value = event.target.value;

        if (value.match(regex)) {
            button.removeAttribute('disabled');
        } else {
            button.setAttribute("disabled", true);
        }
    };
    
    /**
     * 
     * @returns {HTMLElement}
     */
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
        
        const regex = "^[a-zA-Z]{6}$";
        input.addEventListener("keyup", (event)=> {
            this.checkInput(event, button, regex);
        });

        container.appendChild(input);
        container.appendChild(button);
        return container;
    };
    
    /**
     * Créé une div avec une classe
     * @param {string} className 
     * @returns {HTMLElement}
     */
    createDivWithClass(className) {
        let div = document.createElement("div");
        div.setAttribute("class", className);
        return div;
    };
}

function onReady() {
    const section = document.getElementById("game");

    fetch("./data/api.php/words") 
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des données');
            }
            return response.json();
        })
        .then(words => {
            if (Array.isArray(words)) {
                if (section) {
                    new Game(section, words);
                }
            }
        })
        .catch(error => {
            console.error("Erreur lors du chargement du jeu : " + error);
        })
}

document.addEventListener("DOMContentLoaded", onReady);

