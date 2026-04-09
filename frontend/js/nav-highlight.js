// frontend/js/nav-highlight.js
// Markeert de actieve navigatielink op basis van de huidige paginanaam in de URL.
// Verwijdert de 'active'-klasse van alle links en voegt hem toe aan de link
// waarvan het href-attribuut overeenkomt met de huidige pagina.

document.addEventListener("DOMContentLoaded", function () {
  // Haal de bestandsnaam op uit het URL-pad (bijv. 'maintenance.html')
  let currentPage = window.location.pathname.split("/").pop();

  // Gebruik 'index.html' als fallback voor de rootpagina
  if (currentPage === "") {
    currentPage = "index.html";
  }

  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(link => {
    link.classList.remove("active"); // Reset alle actieve klassen
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active"); // Markeer de huidige paginalink
    }
  });
});
