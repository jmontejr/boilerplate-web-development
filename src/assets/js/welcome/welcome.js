class Welcome {
    constructor() {
        this.message = 'Seja bem vindo(a)!';
    }

    insertMessageOnHTML() {
        const elementMessage = document.querySelector('#welcome');
        elementMessage.innerText = this.message;
    }
}