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
        for (let i = 1; i < 7; i++) {
            let wordContainer = this.createDivWithClass(`w-${i}`);
            wordContainer.setAttribute("class", "word-container");
            for (let i = 1; i < 7; i++) {
                let letterContainer = this.createDivWithClass(`lt-${i}`);
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

    if (section) {
        new Game(section, "truc");
    }
}

document.addEventListener("DOMContentLoaded", onReady);

