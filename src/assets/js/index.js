(function main(scripts) {

    const { HomePage } = scripts;

    const home = new HomePage();
    home.insertMessageOnHTML();
    home.mountMainSlider();

})({ HomePage });
