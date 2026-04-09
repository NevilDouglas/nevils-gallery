// updateDateTime.js
function updateDateTime() {
  const now = new Date();

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  const formattedDateTime = now.toLocaleDateString('nl-NL', options);

  const dateTimeContainer = document.getElementById('datetime-container');
  if (dateTimeContainer) {
    dateTimeContainer.textContent = formattedDateTime;
  }

  const yearContainer = document.getElementById('current-year');
  if (yearContainer && yearContainer.textContent !== now.getFullYear().toString()) {
    yearContainer.textContent = now.getFullYear();
  }
}

updateDateTime();
setInterval(updateDateTime, 1000);

export default updateDateTime;
