const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://pefchyjzvnfavwaylidh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZmNoeWp6dm5mYXZ3YXlsaWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjIzNTgsImV4cCI6MjA3NDEzODM1OH0.d5xdW6A6_tdGDurMVGwv1DKFCHHGzWJdB6B7nwY9aRo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAgencies() {
    const { data: agencies, error } = await supabase.from('Agency').select('id, name, companyEmail');
    if (error) { console.error(error); return; }
    console.log('--- AGENCIES ---');
    agencies.forEach(a => console.log(`Agency: ${a.name} | Email: ${a.companyEmail} | ID: ${a.id}`));

    const { data: users, error: uError } = await supabase.from('User').select('email, agencyId');
    if (uError) { console.error(uError); return; }
    console.log('--- USERS ---');
    users.forEach(u => console.log(`User Email: ${u.email} | AgencyID: ${u.agencyId}`));
}
checkAgencies();
