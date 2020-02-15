const message = 'Seja bem-vindo(a)!';

const insertMessageOnHTML = () => {
    const elementMessage = document.querySelector('#hello')
    elementMessage.innerText = message;
}
