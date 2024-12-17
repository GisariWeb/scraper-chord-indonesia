import { getLirik, getListLyricsOfArtist, getListOfAlphabet, searchChord } from './crawler.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
    res.send(await getListLyricsOfArtist(artistUrl));
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
      return res.status(400).send('Missing query');
    }
    res.send(await searchChord(query));
  }
  catch (ex) {
    res.status(500).send(`Error Searching Keywords : ${ex.message}`);
  }
})

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});