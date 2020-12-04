class HomePage {
    constructor() {
        this.message = 'Boilerplate Web Development';
    }

    insertMessageOnHTML() {
        const elementMessage = document.querySelector('#title');
        elementMessage.innerText = this.message;
    }

    mountMainSlider() {
        return tns({
            container: '.slider',
            items: 1,
            slideBy: 'page',
            autoplay: true,
            controls: false,
            nav: true,
            // axis: 'vertical',
            mouseDrag: true,
            navPosition: 'bottom',
            autoplayButtonOutput: false,
            responsive: {
                768: {
                    items: 3
                }
            }
        });
    }
}
