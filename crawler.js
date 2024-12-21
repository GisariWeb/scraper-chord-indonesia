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

export async function getListLyricsOfArtist(artistUrl) {
    try {
        const url = `${theUrl}/chord/${artistUrl}`;
        console.log(url);
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const list = $('.archives a');
        const result = [];
        list.each((i, el) => {
            // console.log($(el).attr('href').replace("https://www.chordindonesia.com/", "/lirik/"));
            result.push({
                title: $(el).text(),
                url: $(el).attr('href').replace("https://www.chordindonesia.com/", "lirik/")
            })
        });
        result.sort((a, b) => a.title.localeCompare(b.title));

        return result;
    }
    catch (ex) {
        console.log(ex);
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

// async function getGoogleSearchWidget(url) {
//     const browser = await puppeteer.launch(
//         { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH }
//     );
//     const page = await browser.newPage();
//     try {
//         await page.goto(url, { waitUntil: 'networkidle0' });

//         // Debugging: Check if the element exists at all
//         const elementExists = await page.evaluate(() => {
//             return document.querySelector('.entry-content') !== null;
//         });
//         console.log('Element exists:', elementExists);

//         // Debugging: If element doesn't exist, log the page content
//         if (!elementExists) {
//             console.log('Page content:', await page.content());
//         }

//         await page.waitForSelector('.gsc-wrapper', { timeout: 60000 });

//         const searchWidgetHtml = await page.$eval('.gsc-wrapper', element => element.outerHTML);
//         console.log(searchWidgetHtml);

//         return searchWidgetHtml;
//     }
//     catch (ex) {
//         console.log(ex);
//     }
//     finally {
//         await browser.close();
//     }
// }


