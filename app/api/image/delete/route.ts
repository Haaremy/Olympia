import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { imageName } = req.body;

    if (!imageName) {
      return res.status(400).json({ error: 'Kein Bildpfad angegeben' });
    }

    try {
      // Die URL der externen PHP-Datei, die das Bild löscht
      const phpUrl = `https://olympia.haaremy.de/uploads/delete.php`;

      // Anfrage an die PHP-Datei senden
      const response = await fetch(phpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ imageName }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Bildes');
      }

      const result = await response.json();
      return res.status(200).json(result);

    } catch (error) {
      return res.status(500).json({ error: 'Interner Serverfehler' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
