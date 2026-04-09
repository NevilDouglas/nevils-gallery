// frontend/js/updateDateTime.js
// Hulpmodule die de huidige datum en tijd bijwerkt in de footer.
// Wordt geïmporteerd en aangeroepen vanuit alle paginascripts.
// Werkt de elementen 'datetime-container' en 'current-year' bij als die aanwezig zijn.

/**
 * Berekent de huidige datum/tijd en schrijft deze naar de DOM-elementen in de footer.
 * Geeft de datum op in het Nederlands (nl-NL) formaat.
 */
function updateDateTime() {
  const now = new Date();

  // Opmaakopties voor de Nederlandse datumweergave
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  const formattedDateTime = now.toLocaleDateString('nl-NL', options);

  // Schrijf de geformatteerde datum/tijd naar het element (als het bestaat)
  const dateTimeContainer = document.getElementById('datetime-container');
  if (dateTimeContainer) {
    dateTimeContainer.textContent = formattedDateTime;
  }

  // Schrijf het huidige jaar naar het element (alleen als het veranderd is)
  const yearContainer = document.getElementById('current-year');
  if (yearContainer && yearContainer.textContent !== now.getFullYear().toString()) {
    yearContainer.textContent = now.getFullYear();
  }
}

// Direct uitvoeren bij laden van het script
updateDateTime();
setInterval(updateDateTime, 1000); // Elke seconde bijwerken

export default updateDateTime;
