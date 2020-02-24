class Welcome {
    constructor() {
        this.message = 'Boilerplate Gulp';
    }

    insertMessageOnHTML() {
        const elementMessage = document.querySelector('#welcome');
        elementMessage.innerText = this.message;
    }
}
