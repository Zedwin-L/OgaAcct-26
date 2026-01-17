// Oga Account - Login API (The Engine Room)
// This file securely checks the PIN against the database.

import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  // 1. We only accept POST requests (sending data)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { pin } = req.body;

  // 2. Validate input
  if (!pin) {
    return res.status(400).json({ error: 'PIN is required, abeg.' });
  }

  try {
    // 3. Ask Supabase: "Do we have a user with this unique PIN?"
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('pin_code', pin) // Matches the 'pin_code' column in your Supabase table
      .single();

    // 4. Check if User exists or if there was a database error
    if (error || !user) {
      console.error('Login Failed:', error ? error.message : 'User not found');
      return res.status(401).json({ error: 'Invalid Access Code. Try again.' });
    }

    // 5. Success! Return the user details (Hide the ID/PIN for safety)
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
    console.error('Server Error:', err);
    return res.status(500).json({ error: 'Server wahala. Contact Admin.' });
  }
}
