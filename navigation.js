// Navigation entre les pages
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".side-nav-item");

  navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Retirer la classe active de tous les éléments
      navItems.forEach(nav => nav.classList.remove("active"));
      // Ajouter la classe active à l'élément cliqué
      item.classList.add("active");

      // Navigation vers la page correspondante
      const pages = [
        "index.html",
        "pre-traitement.html",
        "reacteur.html",
        "emissions.html",
        "rapports.html",
        "fiches-csr.html"
      ];

      if (pages[index]) {
        window.location.href = pages[index];
      }
    });
  });

  // Synchroniser le nom dans le héro avec celui de l'utilisateur
  const userNameEl = document.querySelector(".user-name");
  const heroUserNameEl = document.getElementById("hero-user-name");
  if (userNameEl && heroUserNameEl) {
    heroUserNameEl.textContent = userNameEl.textContent;
  }
});

