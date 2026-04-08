import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const jobData = {
      ...data,
      collectionFormStatus: 'new',
      deliveryFormStatus: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const docRef = await addDoc(collection(db, 'jobs'), jobData)
    return NextResponse.json({ id: docRef.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}
