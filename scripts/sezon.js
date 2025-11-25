const nawigacja = document.querySelector(".nawigacja");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 0) {
            nawigacja.classList.add("scroll");
        } else {
            nawigacja.classList.remove("scroll");
        }
    });