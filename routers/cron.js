import * as db from '../database.js';
import * as crawler from '../crawler.js';

// export default async function handler(req, res) {
//     try {
//         const id = req.params.id;
//         if (!id) {
//             return res.status(400).json({ message: `Missing artist id` });
//         }
//         const artist = await db.getArtist(id);
//         res.status(200).json({ message: "Success", data: artist });
//     }
//     catch (ex) {
//         res.status(500).json({ message: `Error fetching artist : ${ex.message}` });
//     }
//     finally {
//         console.info("Crons Executed on : " + new Date().toLocaleString() + "");
//     }
// }

export async function handler(req, res) {
    try {
        const log = "log akses dari cron pada " + new Date().toLocaleString() + "";
        const logResult = await db.insertLog({ log : log } );
        res.status(200).json({ message: "Success", data: logResult });
    }
    catch (ex) {
        res.status(500).json({ message: `Error inserting log : ${ex.message}` });
    }
    finally {
        console.info("Log Executed on : " + new Date().toLocaleString() + "");
    }
}


export async function crawlAndSaveToDB(req, res) {
    try {
        const alphabet = await crawler.getListOfAlphabet();

        const artists = alphabet
            // .filter(item => ["D", "R"].includes(item.title))
            .map(item => item.artist).flat();
        await db.insertArtists(artists);

        return artists;
    }
    catch (ex) {
        throw ex;
    }
}

