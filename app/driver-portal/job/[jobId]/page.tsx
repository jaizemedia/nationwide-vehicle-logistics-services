'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, doc, getDoc, query, where, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'
import type { Job } from '@/lib/types'
import { AuthGuard } from '@/components/driver-portal/auth-guard'
import { PortalHeader } from '@/components/driver-portal/portal-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FileText, MapPin, Loader2 } from 'lucide-react'

export default function JobOverviewPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSignupCount, setActiveSignupCount] = useState(0)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobRef = doc(db, 'jobs', jobId)
        const jobSnap = await getDoc(jobRef)
        
        if (!jobSnap.exists()) {
          setError('Job not found')
          setLoading(false)
          return
        }

        const jobData = { id: jobSnap.id, ...jobSnap.data() } as Job
        setJob(jobData)

        if (jobData.driverId && jobData.driverId !== user?.uid) {
          setError('This job is assigned to another driver.')
        }
      } catch (err) {
        console.error('Error fetching job:', err)
        setError('Failed to load job details')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId, user])

  useEffect(() => {
    const fetchAssignedCount = async () => {
      if (!user) return

      try {
        const jobsRef = collection(db, 'jobs')
        const q = query(jobsRef, where('driverId', '==', user.uid))
        const snapshot = await getDocs(q)
        const jobsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Job))
        const count = jobsData.filter(
          (job) => !(job.collectionFormStatus === 'sent' && job.deliveryFormStatus === 'sent')
        ).length
        setActiveSignupCount(count)
      } catch (err) {
        console.error('Error fetching active signups:', err)
      }
    }

    fetchAssignedCount()
  }, [user])

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </AuthGuard>
    )
  }

  if (error || !job) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col">
          <PortalHeader title="Error" showBack backHref="/driver-portal/lookup" />
          <main className="flex-1 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
              <CardContent className="pt-6 text-center">
                <p className="text-destructive mb-4">{error || 'Job not found'}</p>
                <Button onClick={() => router.push('/driver-portal/lookup')}>
                  Back to Search
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </AuthGuard>
    )
  }

  const canAccessDeliveryForm = job.collectionFormStatus === 'sent'
  const activeSignupLimitReached = activeSignupCount >= 2
  const isJobAssignedToMe = job.driverId === user?.uid
  const canSignUpForJob = !job.driverId && !activeSignupLimitReached

  const handleSignUp = async () => {
    if (!job || !user || !canSignUpForJob) return

    setIsSigningUp(true)
    try {
      const jobRef = doc(db, 'jobs', jobId)
      await updateDoc(jobRef, {
        driverId: user.uid,
        updatedAt: new Date().toISOString(),
      })

      setJob({ ...job, driverId: user.uid })
      setActiveSignupCount((count) => count + 1)
    } catch (err) {
      console.error('Error signing up for job:', err)
      setError('Unable to sign up for this job. Please try again.')
    } finally {
      setIsSigningUp(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <PortalHeader
          title="Job Details"
          showBack
          backHref="/driver-portal/lookup"
          job={job}
        />
        
        <main className="flex-1 p-4 space-y-4">
          {/* Job Details Card */}
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="pt-6 space-y-4">
              {/* Chassis Number */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Chassis Number</p>
                <p className="font-mono">{job.chassisNumber}</p>
              </div>

              <Separator />

              {/* Collection Address */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-black">Collection Address</p>
                    <p className="text-sm">{job.collectionAddress}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(job.collectionAddress + ' ' + job.collectionPostcode)}`, '_blank')}
                  >
                    <MapPin className="h-5 w-5 text-black" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-muted-foreground">Collection Postcode</p>
                    <p>{job.collectionPostcode}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground">Collection Telephone</p>
                    <p>{job.collectionTelephone}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground">Collection Name</p>
                    <p>{job.collectionName}</p>
                  </div>
                  {job.collectionTelephone2 && (
                    <div>
                      <p className="font-semibold text-muted-foreground">2nd Collection Telephone</p>
                      <p>{job.collectionTelephone2}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Delivery Address */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-black">Delivery Address</p>
                    <p className="text-sm">{job.deliveryAddress}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(job.deliveryAddress + ' ' + job.deliveryPostcode)}`, '_blank')}
                  >
                    <MapPin className="h-5 w-5 text-black" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-muted-foreground">Delivery Postcode</p>
                    <p>{job.deliveryPostcode}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground">Delivery Telephone</p>
                    <p>{job.deliveryTelephone}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground">Delivery Name</p>
                    <p>{job.deliveryName}</p>
                  </div>
                  {job.deliveryTelephone2 && (
                    <div>
                      <p className="font-semibold text-muted-foreground">2nd Delivery Telephone</p>
                      <p>{job.deliveryTelephone2}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Notes */}
              {job.specialNotes && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-muted-foreground">Special Notes</p>
                  <p className="text-sm">{job.specialNotes}</p>
                </div>
              )}

              {job.jobProviderNotes && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-muted-foreground">Job Provider Notes</p>
                  <p className="text-sm">{job.jobProviderNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {!job.driverId ? (
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-black">Job Signup</p>
                  <p className="text-sm text-muted-foreground">
                    This job is not yet assigned. Sign up to claim it and access the collection form.
                  </p>
                </div>
                {activeSignupLimitReached ? (
                  <p className="text-sm text-destructive">
                    You already have 2 active jobs. Complete one before signing up for another.
                  </p>
                ) : (
                  <Button
                    className="w-full bg-black hover:bg-neutral-800 text-white"
                    onClick={handleSignUp}
                    disabled={isSigningUp}
                  >
                    {isSigningUp ? 'Signing up...' : 'Sign up for this job'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : isJobAssignedToMe ? (
            <Card className="border border-slate-200 shadow-sm bg-black">
              <CardContent className="space-y-2">
                <p className="text-sm font-semibold text-white">Assigned Job</p>
                <p className="text-sm text-white/80">You are signed up for this job.</p>
              </CardContent>
            </Card>
          ) : null}

          {/* Collection Form Button */}
          <Button
            className="w-full h-auto py-4 bg-white hover:bg-gray-50 text-foreground border border-border justify-between"
            onClick={() => router.push(`/driver-portal/job/${jobId}/collection`)}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-black" />
              <div className="text-left">
                <p className="font-semibold text-black">Collection Form</p>
                <p className={`text-sm ${job.collectionFormStatus === 'sent' ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {job.collectionFormStatus === 'sent' ? 'Sent' : job.collectionFormStatus === 'in-progress' ? 'In Progress' : 'New'}
                </p>
              </div>
            </div>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* Delivery Form Button */}
          <Button
            className={`w-full h-auto py-4 bg-white hover:bg-gray-50 text-foreground border border-border justify-between ${!canAccessDeliveryForm ? 'opacity-50' : ''}`}
            onClick={() => canAccessDeliveryForm && router.push(`/driver-portal/job/${jobId}/delivery`)}
            disabled={!canAccessDeliveryForm}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-black" />
              <div className="text-left">
                <p className="font-semibold text-black">Delivery Form</p>
                <p className={`text-sm ${job.deliveryFormStatus === 'sent' ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {!canAccessDeliveryForm 
                    ? 'Complete collection first' 
                    : job.deliveryFormStatus === 'sent' 
                      ? 'Sent' 
                      : job.deliveryFormStatus === 'in-progress' 
                        ? 'In Progress' 
                        : 'New'}
                </p>
              </div>
            </div>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* Remove Button */}
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => router.push('/driver-portal/lookup')}
          >
            Remove
          </Button>
        </main>
      </div>
    </AuthGuard>
  )
}
