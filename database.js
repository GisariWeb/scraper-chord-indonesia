import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'chordid' },
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    }
});

/// AUTHENTICATION
const signInWithPassword = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        throw error;
    }

    return data.user;
};

const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log(error)
    }
};


const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    // console.log(session);
    if (error) {
        console.log(error);
        return null;
    }

    if (session == null) return null;
    return session;
}

const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.log(error)
    }
    return data?.user;
};


const getListByPageAndSize = async (tableName, select = '*', page, pageSize) => {
    try {
        // Calculate the range of items to fetch based on page and pageSize
        const start = (page - 1) * pageSize; // Start index (0-based)
        const end = start + pageSize - 1;    // End index (inclusive)

        const { data, error, count } = await supabase
            .from(tableName)
            .select(select, { count: 'exact' }) // Select all columns, and get a count of the total rows.
            .range(start, end);  // Use range to fetch items for the specific page

        if (error) {
            throw error;
        }

        return {
            data: data, // Array of items for the current page
            totalCount: count, // total number of items.
            currentPage: page,
            pageSize: pageSize,
        };
    } catch (error) {
        throw error;
    }
};

//// ARTIST
const insertArtist = async (name, url, img_url, thumb_img_url) => {
    const { data, error } = await supabase
        .from('artist')
        .insert([
            { name: name, url: url, img_url: img_url, thumb_img_url: thumb_img_url, modified_at: new Date() },
        ])
        .select();

    if (error) {
        console.log(error)
        return error
    }
    return data
}

const updateArtist = async (id, name, url, img_url, thumb_img_url) => {
    const { data, error } = await supabase
        .from('artist')
        .update({ name: name, url: url, img_url: img_url, thumb_img_url: thumb_img_url, modified_at: new Date() })
        .eq('id', id)
    if (error) {
        console.log(error)
        return false
    }
    return data
}


const getArtist = async (id) => {
    const { data, error } = await supabase
        .from('artist')
        .select('*')
        .eq('id', id)
    if (error) {
        throw error;
    }
    return data
}

const deleteArtist = async (id) => {
    const { data, error } = await supabase
        .from('artist')
        .delete()
        .eq('id', id)
    if (error) {
        console.log(error)
        return false
    }
    return data
}

export {
    signInWithPassword, signOut, getSession, getUser,
    insertArtist, updateArtist, getArtist, deleteArtist,
}
