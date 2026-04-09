import { useState, useEffect } from 'react';

export default function useDateTime() {
  const [formattedDateTime, setFormattedDateTime] = useState('Laden...');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
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
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return { formattedDateTime, currentYear };
}
