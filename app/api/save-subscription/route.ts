import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  const sub = await req.json()
  // Save sub to Firestore, link to user or number plate if available
  await addDoc(collection(db, 'subscriptions'), sub)
  return NextResponse.json({ ok: true })
}
