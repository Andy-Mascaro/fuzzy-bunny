// Create your own supabase database using the provided seeds.sql file
const SUPABASE_URL = 'https://kdukidihcdlbgresawun.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdWtpZGloY2RsYmdyZXNhd3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQzNDE0NDYsImV4cCI6MTk1OTkxNzQ0Nn0.YtwzCCX2zDt5IzpJ-Uh5Hy4DsanDjeq6lfG72ezSCW4';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export function getUser() {
    return client.auth.session() && client.auth.session().user;
}

export async function getFamilies() {
    const resp = await client.from('loving_families').select('*,fuzzy_bunnies (*)').match({ 'fuzzy_bunnies.user_id': client.auth.session().user.id });
    return checkError(resp);
    // fetch all families and their bunnies

    
}

export async function deleteBunny(id) {
    const resp = await client.from('fuzzy_bunnies').delete().match({ id: id }).single();
        
    // delete a single bunny using the id argument

    return checkError(resp);
}

export async function createBunny(bunny) {
    const resp = await client.from('fuzzy_bunnies').insert({ ... bunny, user_id: client.auth.session().user.id });


    // create a bunny using the bunny argument

    return checkError(resp);
}

// MARTHA STEWART (PRE-MADE) FUNCTIONS

export async function checkAuth() {
    const user = getUser();

    if (!user) location.replace('../');
}

export async function redirectIfLoggedIn() {
    if (getUser()) {
        location.replace('./families');
    }
}

export async function signupUser(email, password) {
    const resp = await client.auth.signUp({ email, password });

    return resp.user;
}

export async function signInUser(email, password) {
    const resp = await client.auth.signIn({ email, password });

    return resp.user;
}

export async function logout() {
    await client.auth.signOut();

    return (window.location.href = '../');
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}
