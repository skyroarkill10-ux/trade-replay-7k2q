// Trade Replay — cloud accounts (Supabase). Both values are public by design (the publishable key only works through the
// row-level security rules in the database). NEVER put a secret / service_role key here.
// Empty values = the app runs as before: guest + offline, no sign-in.
window.TR_CONFIG = {
  supabaseUrl: 'https://zqlxspvzmcbxxzgidgze.supabase.co',
  supabaseKey: 'sb_publishable_zfSW1fyA9H6-r-OMQ9OcPQ_YKk9bRBd',
};
