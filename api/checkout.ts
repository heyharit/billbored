import Razorpay from 'razorpay';

// Helper for CORS
const allowCors = (fn: any) => async (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { url, displayName, description, category, bidAmount, bgImageUrl, editCode, upgradeId } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    // Create an order in Razorpay
    const options = {
      // BillboredX shows prices in USD, so we process in USD. 
      // (Ensure international payments are enabled in your Razorpay dashboard if using USD)
      amount: bidAmount * 100, 
      currency: 'USD', 
      receipt: `receipt_${Date.now()}`,
      notes: {
        url,
        displayName,
        description,
        category,
        bidAmount: bidAmount.toString(),
        bgImageUrl,
        editCode,
        upgradeId: upgradeId || '', // Pass empty string if new
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency 
    });
  } catch (err: any) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ error: err.message });
  }
};

export default allowCors(handler);
