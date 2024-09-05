import express, { Request, Response } from 'express';
import { nanoid } from 'nanoid';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

interface URLMapping {
  url: string;
  counter: number;
}

interface URLDatabase {
  [key: string]: URLMapping;
}

const urlDatabase: URLDatabase = {};

// Helper function to validate custom codes
const isValidCustomCode = (code: string): boolean => {
  return /^[a-zA-Z0-9]{4,}$/.test(code);
};

// Create a shortened URL
app.post('/shorten', (req: Request, res: Response) => {
  const { url, customCode } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let shortCode: string;

  if (customCode) {
    if (!isValidCustomCode(customCode)) {
      return res.status(400).json({ error: 'Custom code must be at least 4 characters long and contain only alphanumeric characters.' });
    }
    if (urlDatabase[customCode]) {
      return res.status(409).json({ error: 'Custom code already in use.' });
    }
    shortCode = customCode;
  } else {
    do {
      shortCode = nanoid(6);
    } while (urlDatabase[shortCode]);
  }

  urlDatabase[shortCode] = { url, counter: 0 };

  const shortenedUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
  res.json({ originalUrl: url, shortenedUrl, shortCode });
});

// Route to redirect to the original URL
app.get('/redirect/:shortCode', (req: Request, res: Response) => {
  const shortCode = req.params.shortCode;
  const mapping = urlDatabase[shortCode];

  if (mapping) {
    mapping.counter++;
    res.redirect(mapping.url);
  } else {
    res.status(404).json({ error: 'URL not found' });
  }
});

// Route to get statistics for all short codes
app.get('/stats', (req: Request, res: Response) => {
  const stats = Object.entries(urlDatabase).map(([code, { url, counter }]) => ({
    shortCode: code,
    url,
    redirectCount: counter,
  }));

  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});