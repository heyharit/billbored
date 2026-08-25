// @ts-nocheck
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

const allowCors = (fn: any) => async (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  return await fn(req, res);
};

const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { upgradeId, editId, editCode, url, displayName, description, category, bgImageUrl } = req.body;

  if (!upgradeId || !editId || !editCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!db) return res.status(500).json({ error: 'Firestore not initialized' });

  try {
    // Verify ownership by checking editId + editCode match in Firestore
    const docRef = db.collection('listings').doc(upgradeId);
    const doc = await docRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'Listing not found' });

    const data = doc.data();
    if (data.editId !== editId || data.editCode !== editCode) {
      return res.status(403).json({ error: 'Invalid credentials' });
    }

    // Update details only — no price change
    await docRef.update({
      url,
      displayName,
      description,
      category,
      bgImageUrl,
      title: url.replace(/^https?:\/\//i, '').split('/')[0],
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Error updating listing details:', err);
    return res.status(500).json({ error: err.message });
  }
};

export default allowCors(handler);
