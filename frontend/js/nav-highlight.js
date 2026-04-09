// frontend/js/nav-highlight.js

document.addEventListener("DOMContentLoaded", function () {
  let currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "") {
    currentPage = "index.html";
  }

  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});
