class Game {
    constructor(element, word) {
        this.element = element;
        this.word = word;
        this.container = this.createDivWithClass("game-container");
        this.game = this.initializeGame();
        this.form = this.createForm();
        this.container.appendChild(this.game);
        this.container.appendChild(this.form);
        this.element.appendChild(this.container);
    }

    initializeGame() {
        let container = this.createDivWithClass("game");
        for (let ia = 1; ia < 7; ia++) {
            let wordContainer = this.createDivWithClass(`w-${ia}`);
            wordContainer.setAttribute("class", "word-container");
            for (let ib = 1; ib < 7; ib++) {
                let letterContainer = this.createDivWithClass(`lt-${ib}`);
                letterContainer.setAttribute("class", "letter-container");
                let letter = document.createElement("h3");
                letter.setAttribute("class", "letter");
                letterContainer.appendChild(letter);
                wordContainer.appendChild(letterContainer);
            };
            container.appendChild(wordContainer);
        }
        container.children[0].children[0].children[0].textContent = this.word.charAt(0);
        return container;
    }

    submitWord() {
        
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
        button.addEventListener("click", this.submitWord);
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
            console.error("Erreur lors du chargement des données");
        })

}

document.addEventListener("DOMContentLoaded", onReady);

