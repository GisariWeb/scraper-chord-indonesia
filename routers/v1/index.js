import express from 'express';
import * as db from '../../database.js';
import { STATUS_CODE } from '../../utils.js';
import { crawlAndSaveToDB } from '../cron.js';

const v1 = express.Router();

// Middleware to Protect Routes
const authenticate = (req, res, next) => {
    if (!req.session?.user) {
        return res.status(401).json();
    }
    next();
};

v1.use((req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        const modifiedJson = {
            success: (res.statusCode >= 200 && res.statusCode < 300) ? true : false,
            message: !data?.message ? STATUS_CODE[res.statusCode] : data?.message,
            data: data?.data,
        }
        originalJson(modifiedJson);
    };

    next();
});

// Set up middleware to handle Supabase session
v1.use(async (req, res, next) => {
    const session = await db.getSession();
    req.session = session;
    next();
});


v1.post('/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing email or password' });
        }
        const user = await db.signInWithPassword(email, password);
        const session = await db.getSession();
        if (!user) {
            res.status(401).json({ message: "User not Found" });
        }
        req.session = session;
        res.status(200).json({ message: user });
    }
    catch (ex) {
        res.status(500).json({ message: `Error sign in : ${ex.message}` });
    }
})

v1.get('/auth/google', async (req, res) => {
    try {
        const url = await db.signInWithGoogle();
        return res.redirect(url)
    }
    catch (ex) {
        res.status(500).json({ message: `Error sign in with Google: ${ex.message}` });
    }
})

v1.get('/auth/callback', async (req, res) => {
    try {
        // This URL will be received after successfull sign in
        // get the code query from url
        const code = req.query.code
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            throw error;
        }
        // You have the session data now, store the session or perform any logic you want.
        // set session and send to client
        req.session = data.session
        return res.status(200).json({ data : data })
    } catch (ex) {
        res.status(500).json({ message: `Error Google Sign in Callback : ${ex.message}` });
    }
})


v1.post('/artist', authenticate, async (req, res) => {
    try {
        const { name, url } = req.body;
        if (!name || !url) {
            return res.status(400).json({ message: 'Missing name or url' });
        }
        const newArtist = await db.insertArtist(name, url);
        res.status(201).json({ message: "Success", data: newArtist });
    }
    catch (ex) {
        res.status(500).json({ message: `Error inserting new artist : ${ex.message}` });
    }
});



v1.get('/artist/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Missing artist id' });
        }
        const artist = await db.getArtist(id);
        res.status(200).json({ message: "Success", data: artist });
    }
    catch (ex) {
        res.status(500).json({ message: `Error fetching artist : ${ex.message}` });
    }
});


v1.get('/flat-artist', authenticate, async (req, res) => {
    try {
        const list = await crawlAndSaveToDB();
        res.status(200).json({ data: list });
    }
    catch (ex) {
        res.status(500).send(`Error fetching List of Content : ${ex.message}`);
    }
})

export default v1;