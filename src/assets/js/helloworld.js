const message = 'Seja bem-vindo(a)!';

const insertMessageInHTML = () => {
    const elementMessage = document.querySelector('#hello')
    elementMessage.innerText = message;
}
