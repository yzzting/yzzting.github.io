/**
 * mobile sidebar
 */

function initMobileMenu() {
    var mobileBar = document.getElementById('mobile-bar');
    var sidebar = document.querySelector('.sidebar');
    var menuButton = mobileBar.querySelector('.menu-button');

    menuButton.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    })

    document.body.addEventListener('click', function(e) {
        if (e.target !== menuButton && !sidebar.contains(e.target)) {
            sidebar.classList.remove('open')
        }
    })
}

initMobileMenu();
