import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Only run on the server
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return NextResponse.json({ error: 'Server only' }, { status: 400 })
  }
  const { jobId, status } = await req.json()
  // Lazy import server-only modules
  const admin = (await import('firebase-admin')).default
  const webpushModule = await import('web-push')
  const webpush: typeof import('web-push') = webpushModule

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    })
  }
  const db = admin.firestore()

  webpush.setVapidDetails(
    'mailto:jaydon.armahgodwin@gmail.com',
    'BAs3mf9YuDuG3DwiLDIJL3QthQwVscDW6AKB0bwe5Hp_cbFBvuVqVgEUqesRZQFCSL_jAPhm5ED6oEQ-kVlFIMA',
    'dgRvRG9-oOejGuy74k0Kb0Nmif1cBoL_i38jPSc6njQ'
  )

  const subsSnap = await db.collection('subscriptions').get()
  const subs = subsSnap.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => doc.data())
  const payload = JSON.stringify({
    title: 'Job Status Updated',
    body: `Your job (${jobId}) is now: ${status}`,
    url: `/client-portal`,
  })
  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub as import('web-push').PushSubscription, payload)
    } catch (err) {
      // Optionally handle errors
    }
  }
  return NextResponse.json({ ok: true })
}
