// frontend-react/src/components/Footer.jsx
// Voettekstcomponent die onderaan elke pagina wordt weergegeven.
// Toont het huidige jaar en de actuele datum/tijd via de useDateTime-hook.

import useDateTime from '../hooks/useDateTime';

export default function Footer() {
  // Haal de geformatteerde datum/tijd en het huidige jaar op uit de hook
  const { formattedDateTime, currentYear } = useDateTime();

  return (
    <footer>
      <p>&copy; {currentYear} Nevil's Final Gallery | {formattedDateTime}</p>
    </footer>
  );
}
