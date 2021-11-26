function toggleMenu() {
    const menu = document.querySelector(".menu");
    const hidden = document.querySelector(".asideMenu");

    menu.classList.toggle("noDisplay");
    hidden.classList.toggle("noDisplay")
}