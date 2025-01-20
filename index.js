import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getLirik, getStartLyricsListOfArtist, getLyricsListOfArtist, getListOfAlphabet, searchChord } from './crawler.js';
import v1 from './routers/v1/index.js';

const PORT = parseInt(process.env.PORT) || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  const originalSend = res.send.bind(res);

  res.send = (data) => {
    const duration = Date.now() - start;
    res.setHeader('X-Response-Time', duration + 'ms');
    originalSend(data);
  };

  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use('/v1', v1);

//######### ROUTING START ############

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

app.get('/lirik/:title', async (req, res) => {
  try {
    const songTitle = req.params.title;
    if (!songTitle) {
      return res.status(400).send('Missing song Title');
    }
    const { title, lyrics } = await getLirik(songTitle);
    console.log(title);
    res.render('lirik', { title: title, lyrics: lyrics });
    // res.send(`${lirik}`);
  }
  catch (ex) {
    res.status(500).send(`Error fetching lyrics : ${ex.message}`);
  }
});

app.get('/daftar-artist', async (req, res) => {
  try {
    res.send(await getListOfAlphabet());
  }
  catch (ex) {
    res.status(500).send(`Error fetching List of Content : ${ex.message}`);
  }
})

app.get('/daftar-isi', async (req, res) => {
  try {
    res.send(await getListOfAlphabet());
  }
  catch (ex) {
    res.status(500).send(`Error fetching List of Content : ${ex.message}`);
  }
})

app.get('/daftar-lirik/:artistUrl', async (req, res) => {
  try {
    const artistUrl = req.params.artistUrl;
    res.send(await getStartLyricsListOfArtist(artistUrl));
  }
  catch (ex) {
    res.status(500).send(`Error fetching List of Content : ${ex.message}`);
  }
});


app.get('/cari/:query', async (req, res) => {
  try {
    // const query = req.query.q;
    const query = req.params.query;

    if (!query) {
      return res.status(400).json({ message: 'Missing query' });
    }
    const data = await searchChord(query);
    res.json({ message: "Success", data: data });
  }
  catch (ex) {
    res.status(500).json({ message: `Error Searching Keywords : ${ex.message}` });
  }
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Page Not Found' });
});
