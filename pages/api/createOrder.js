import { createClient } from '@supabase/supabase-js';

// Initialize Supabase directly here to avoid "Module not found" errors with the lib folder
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // 1. Security Check: Only allow sending data (POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { waiter_id, items, customer_ref } = req.body;

  if (!waiter_id || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing order details.' });
  }

  try {
    // 2. Calculate Totals
    // Default N50 commission per item (Drink or Food)
    const COMMISSION_RATE = 50; 
    
    let totalOrderAmount = 0;
    let totalCommission = 0;

    // We assume 'items' comes with price and quantity from the frontend
    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const itemComm = COMMISSION_RATE * item.quantity;

      totalOrderAmount += itemTotal;
      totalCommission += itemComm;
    });

    // 3. Save the Order to Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        { 
          waiter_id, 
          customer_ref, 
          total_amount: totalOrderAmount, 
          total_commission: totalCommission,
          status: 'pending' 
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Update the Waiter's Debt and Commission (The "Oga" Logic)
    // First, get the current balance
    const { data: waiter, error: waiterError } = await supabase
      .from('users')
      .select('debt_total, commission_total')
      .eq('id', waiter_id)
      .single();

    if (waiterError) throw waiterError;

    // Now update the balance
    const { error: updateError } = await supabase
      .from('users')
      .update({
        debt_total: (waiter.debt_total || 0) + totalOrderAmount,
        commission_total: (waiter.commission_total || 0) + totalCommission
      })
      .eq('id', waiter_id);

    if (updateError) throw updateError;

    // 5. Success!
    return res.status(200).json({ success: true, order });

  } catch (err) {
    console.error('Order Error:', err);
    return res.status(500).json({ error: 'Wahala happened while saving order.' });
  }
}
