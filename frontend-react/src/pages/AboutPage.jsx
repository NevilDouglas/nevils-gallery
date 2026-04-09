// frontend-react/src/pages/AboutPage.jsx
// Informatiepagina over de galerij en de technische opbouw van de applicatie.
// De body-klasse 'about-page' wordt ingesteld voor paginaspecifieke CSS-stijlen.

import { useEffect } from 'react';

export default function AboutPage() {
  // Stel de body-klasse in voor paginaspecifieke achtergrondstijl
  useEffect(() => {
    document.body.className = 'about-page';
    return () => { document.body.className = ''; }; // Herstel bij verlaten van de pagina
  }, []);

  return (
    <main className="content">
      <h1>ℹ️ About this Gallery</h1>
      <p>
        <strong>Nevil's Final Gallery</strong> is a digital art gallery where technology and aesthetics come together.<br /><br />

        This application was built as a full-stack project with a <strong>Node.js backend</strong> and a <strong>React frontend</strong>.
        The backend manages a PostgreSQL database and supports full CRUD operations via a REST API.<br /><br />

        Users can add, view, sort, and filter paintings. File uploads are also supported, thanks to the integration of
        <code>multer</code>.
        All data is retrieved and rendered using modern web technologies.<br /><br />

        ✨ Features:<br />
        - Dynamic table view with pagination and filters<br />
        - Direct image uploads to the server<br />
        - Painting preview section on the homepage<br />
        - Full error handling and user feedback<br /><br />

        This gallery was designed as a tribute to the beauty of art — and the power of well-written code.<br /><br />
        Should you have any questions or suggestions, feel free to reach out to me{' '}
        <a href="mailto:nevil.douglas@gmail.com">via e-mail.</a>
      </p>
    </main>
  );
}
