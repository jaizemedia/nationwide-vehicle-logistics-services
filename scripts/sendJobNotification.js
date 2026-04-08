// Usage: node scripts/sendJobNotification.js <jobId> <status>
const admin = require('firebase-admin');
const webpush = require('web-push');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();

// VAPID keys
webpush.setVapidDetails(
  'mailto:jaydon.armahgodwin@gmail.com',
  'BAs3mf9YuDuG3DwiLDIJL3QthQwVscDW6AKB0bwe5Hp_cbFBvuVqVgEUqesRZQFCSL_jAPhm5ED6oEQ-kVlFIMA',
  'dgRvRG9-oOejGuy74k0Kb0Nmif1cBoL_i38jPSc6njQ'
);

async function sendNotification(jobId, status) {
  // Fetch all subscriptions (optionally filter by jobId/numberPlate)
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
      console.log('Notification sent');
    } catch (err) {
      console.error('Notification error:', err);
    }
  }
}

if (require.main === module) {
  const [jobId, status] = process.argv.slice(2);
  if (!jobId || !status) {
    console.error('Usage: node sendJobNotification.js <jobId> <status>');
    process.exit(1);
  }
  sendNotification(jobId, status).then(() => process.exit());
}
