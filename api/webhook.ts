// @ts-nocheck
import crypto from 'crypto';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin (Only once)
if (!getApps().length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountStr) throw new Error('FIREBASE_SERVICE_ACCOUNT env variable is missing');
    const serviceAccount = JSON.parse(serviceAccountStr);
    initializeApp({ credential: cert(serviceAccount) });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const db = getApps().length ? getFirestore() : null;

export const config = {
  api: { bodyParser: false },
};

const getRawBody = async (req: any) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const rawBody = await getRawBody(req);
  const signature = req.headers['x-razorpay-signature'] as string;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody.toString('utf-8'))
    .digest('hex');

  if (expectedSignature !== signature) {
    console.error('Razorpay Webhook signature verification failed.');
    return res.status(400).send('Invalid signature');
  }

  const event = JSON.parse(rawBody.toString('utf-8'));

  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const payment = event.payload.payment.entity;
    const metadata = payment.notes;

    if (!db) return res.status(500).json({ error: 'Firestore not initialized' });

    try {
      if (!metadata) throw new Error('Missing notes in Razorpay payload');

      const { url, displayName, description, category, bidAmount, bgImageUrl, editCode, editId, upgradeId } = metadata;
      const bid = parseFloat(bidAmount);

      if (upgradeId) {
        // ── UPGRADE: ADD bid to existing currentPrice (never replace it)
        await db.collection('listings').doc(upgradeId).update({
          url,
          displayName,
          bgImageUrl,
          title: url.replace(/^https?:\/\//i, '').split('/')[0],
          description,
          category,
          // FieldValue.increment ensures we ADD to currentPrice, not overwrite
          currentPrice: FieldValue.increment(bid),
        });
        console.log(`Upgraded listing ${upgradeId} by +$${bid}`);
      } else {
        // ── NEW LISTING
        const newId = `list-${Date.now()}`;
        await db.collection('listings').doc(newId).set({
          url,
          displayName,
          bgImageUrl,
          editCode: editCode || '',
          editId: editId || '',
          title: url.replace(/^https?:\/\//i, '').split('/')[0],
          description,
          category,
          currentPrice: bid,
          clicks: 0,
          purchasedAt: Date.now(),
        });
        console.log(`Created new listing ${newId}`);
      }
    } catch (dbError) {
      console.error('Error writing to Firestore:', dbError);
      return res.status(500).json({ error: 'Database update failed' });
    }
  }

  res.status(200).json({ status: 'ok' });
};

export default handler;
