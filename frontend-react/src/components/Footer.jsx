import useDateTime from '../hooks/useDateTime';

export default function Footer() {
  const { formattedDateTime, currentYear } = useDateTime();

  return (
    <footer>
      <p>&copy; {currentYear} Nevil's Final Gallery | {formattedDateTime}</p>
    </footer>
  );
}
