import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabaseUrl = 'https://vrrfvovzjdjbtmaxhqqy.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY!;


export const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);
