
const Hamb = document.querySelector("#icon_menu").addEventListener("click", mostrar_menu)
const menu = document.querySelector(".menu")
function mostrar_menu(){
    menu.classList.toggle("mostrar_menu")
}

document.addEventListener("click", function(event) {
    const menu = document.querySelector(".menu");
    const iconMenu = document.getElementById("icon_menu");

    if (!menu.contains(event.target) && event.target !== iconMenu) {
        menu.classList.remove("mostrar_menu");
    }
});

document.addEventListener("scroll", function() {
    const menu = document.querySelector(".menu");
    menu.classList.remove("mostrar_menu");
});



