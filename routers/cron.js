import * as db from '../database.js';

export default async function handler(req, res)  {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({message : 'Missing artist id' });
        }
        const artist = await db.getArtist(id);
        res.status(200).json({ message: "Success", data: artist });
    }
    catch (ex) {
        res.status(500).json({ message: `Error fetching artist : ${ex.message}` });
    }
}