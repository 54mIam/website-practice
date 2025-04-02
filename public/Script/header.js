const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".navbar-menu");

menu.addEventListener("click", function() {
    menu.classList.toggle("is-active");
    menuLinks.classList.toggle("active");
});

document.querySelector(".index-btn").addEventListener("click", function () {
    document.querySelector(".page-info").classList.add("hide");

    // Show the webpage-container section
    document.querySelector(".webpage-container").classList.remove("hide");

});