const mainjs = window.mainjs || {};

mainjs.responsiveButton = ((document) => {
        let hamburgerContainer = document.querySelector('#header__main-nav')
        let hamburger = document.querySelector('.header__main-nav--hamburger')
        let links = document.querySelectorAll('.header__main-nav--links li')
        hamburger.addEventListener('click',(el) => {
            hamburgerContainer.classList.toggle('clicked');
            links.forEach((link) => {
             link.classList.toggle('fade'); 
             alert("hallo")
    })

});
})(document)


