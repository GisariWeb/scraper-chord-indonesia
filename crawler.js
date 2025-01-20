import * as dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import * as cheerio from 'cheerio';

const theUrl = process.env.CHORD_URL;
export async function getLirik(title) {
    try {
        console.log(theUrl);
        const url = `${theUrl}/${title}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const lyricsElement = $('.entry-content').find('pre');
        const titleElement = $('title').text().replace(/©Chordindonesia.com/gi, '');
        const lyrics = lyricsElement.html();
        // console.log(titleElement);

        // console.log("Lyrics:", lyrics);

        return { title: titleElement, lyrics: lyrics };
    }
    catch (ex) {
        throw ex;
        // console.error("Error scraping:", ex);
    }
}

const getArtist = async (artist) => {

}

export async function getListOfAlphabet() {
    try {
        const url = `${theUrl}/daftar-isi`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const list = $('.entry-content > table a');
        const result = [];

        let promises = [];
        list.each((i, el) => {
            promises.push(getListOfArtist($(el).attr('href')).then(artist => {
                result.push({
                    title: $(el).text(),
                    url: $(el).attr('href'),
                    artist: artist,
                });
            }));
        });

        await Promise.all(promises);
        result.sort((a, b) => a.title.localeCompare(b.title));
        return result;
    }
    catch (ex) {
        throw ex;
    }
}

export async function getListOfArtist(url) {
    try {
        console.log(url);
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const list = $('.entry-content a');
        const result = [];
        list.each((i, el) => {
            result.push({
                name: $(el).text(),
                url: $(el).attr('href').replace(`https://www.chordindonesia.com/chord/`, `/daftar-lirik/`)
            })
        });
        result.sort((a, b) => a.name.localeCompare(b.name));
        return result;
    }
    catch (ex) {
        console.log(ex);
        throw ex;
    }
}

export async function getStartLyricsListOfArtist(artistUrl) {
    try {
        const url = `${theUrl}/chord/${artistUrl}`;
        console.log(url);
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const list = $('.archives a');
        const result = [];
        list.each((i, el) => {
            result.push({
                title: $(el).text(),
                url: $(el).attr('href').replace("https://www.chordindonesia.com/", "lirik/")
            })
        });

        let promises = [];
        const pagination = $('.wp-pagenavi a');
        pagination.each((i, el) => {
            // console.log($(el).text(), $(el).attr('href'));
            if ($(el).text() != "»") {
                promises.push(getLyricsListOfArtist($(el).attr('href')).then(res => {
                    // console.log(res);
                    result.push(...res);
                }));
            }
        });

        await Promise.all(promises);
        

        result.sort((a, b) => a.title.localeCompare(b.title));
        console.log(`jumlah lirik : ${result.length}`);
        return result;
    }
    catch (ex) {
        console.log(ex);
        throw ex;
    }
}


export async function getLyricsListOfArtist(artistUrl) {
    try {
        // const url = `${theUrl}/chord/${artistUrl}`;
        const url = artistUrl;
        console.log(url);
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const list = $('.archives a');
        const result = [];
        list.each((i, el) => {
            result.push({
                title: $(el).text(),
                url: $(el).attr('href').replace("https://www.chordindonesia.com/", "lirik/")
            })
        });

        result.sort((a, b) => a.title.localeCompare(b.title));

        return result;
    }
    catch (ex) {
        // console.log(ex);
        throw ex;
    }
}

export async function searchChord(keyword) {
    try {
        const url = `${theUrl}/hasil-pencarian-chord-kunci-gitar?q=${keyword}`;
        console.log(url);
        // const response = await axios.get(url);
        // const responseHtml = getPageContentAfterLoad(url);
        const responseHtml = await getGoogleSearchWidget(url);
        return responseHtml;
        // const searchResultsHtml = await waitForGoogleSearchResults('.google-search-results'); // Adjust selector
        const $ = cheerio.load(response.data);
        const list = $('.entry-content a');
        const result = [];
        list.each((i, el) => {
            result.push({
                title: $(el).text(),
                url: $(el).attr('href')
            })
        });
        result.sort((a, b) => a.name.localeCompare(b.name));

        return result;
    }
    catch (ex) {
        throw ex;
    }
}
