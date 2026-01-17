import { createClient } from '@supabase/supabase-js';

// Initialize Supabase directly here (Bypassing the missing lib folder)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { pin } = req.body;

  if (!pin) {
    return res.status(400).json({ error: 'PIN is required, abeg.' });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('pin_code', pin)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid Access Code. Try again.' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        staff_id: user.staff_id
      }
    });

  } catch (err) {
    return res.status(500).json({ error: 'Server wahala. Contact Admin.' });
  }
}
