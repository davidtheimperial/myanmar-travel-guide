document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", function() {
        const isExpanded = navLinks.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", isExpanded);
    });
});