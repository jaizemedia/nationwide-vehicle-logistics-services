import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  try {
    const { numberPlate } = await req.json()
    if (!numberPlate) {
      return NextResponse.json({ error: 'Number plate required' }, { status: 400 })
    }
    const jobsRef = collection(db, 'jobs')
    const q = query(jobsRef, where('vehicleRegistration', '==', numberPlate))
    const snapshot = await getDocs(q)
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json({ jobs }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}
