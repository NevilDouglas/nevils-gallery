// frontend-react/src/hooks/useDateTime.js
// Aangepaste React-hook die de huidige datum/tijd bijhoudt en elke seconde bijwerkt.
// Geeft een geformatteerde Nederlandse datum/tijdstring terug, en het huidige jaar.
// Wordt gebruikt in de Footer-component.

import { useState, useEffect } from 'react';

/**
 * Hook die de huidige datum en tijd elke seconde bijwerkt.
 * @returns {{ formattedDateTime: string, currentYear: number }}
 */
export default function useDateTime() {
  const [formattedDateTime, setFormattedDateTime] = useState('Laden...');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Bereken en sla de huidige datum/tijd op
    function update() {
      const now = new Date();
      setFormattedDateTime(
        now.toLocaleDateString('nl-NL', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentYear(now.getFullYear());
    }

    update(); // Direct uitvoeren bij mounten

    // Stel een interval in om elke seconde bij te werken
    const interval = setInterval(update, 1000);

    // Ruim het interval op bij unmounten van de component
    return () => clearInterval(interval);
  }, []);

  return { formattedDateTime, currentYear };
}
