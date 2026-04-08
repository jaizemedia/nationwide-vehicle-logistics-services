import admin from 'firebase-admin';
import webpush from 'web-push';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();

webpush.setVapidDetails(
  'mailto:jaydon.armahgodwin@gmail.com',
  'BAs3mf9YuDuG3DwiLDIJL3QthQwVscDW6AKB0bwe5Hp_cbFBvuVqVgEUqesRZQFCSL_jAPhm5ED6oEQ-kVlFIMA',
  'dgRvRG9-oOejGuy74k0Kb0Nmif1cBoL_i38jPSc6njQ'
);

export async function notifyJobStatus(jobId: string, status: string) {
  const subsSnap = await db.collection('subscriptions').get();
  const subs = subsSnap.docs.map(doc => doc.data());
  const payload = JSON.stringify({
    title: 'Job Status Updated',
    body: `Your job (${jobId}) is now: ${status}`,
    url: `/client-portal`,
  });
  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      // Optionally handle errors (e.g., remove invalid subscriptions)
    }
  }
}
