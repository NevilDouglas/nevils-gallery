import updateDateTime from "./updateDateTime.js";

document.addEventListener("DOMContentLoaded", function () {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
