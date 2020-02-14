const message = 'Hello World';

const insertMessageInHTML = () => {
    const elementHello = document.querySelector('#hello')
    elementHello.innerText = message;
}
