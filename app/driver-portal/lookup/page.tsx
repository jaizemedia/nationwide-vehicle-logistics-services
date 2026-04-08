'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'
import type { Job } from '@/lib/types'
import { AuthGuard } from '@/components/driver-portal/auth-guard'
import { PortalHeader } from '@/components/driver-portal/portal-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Loader2 } from 'lucide-react'

export default function JobLookupPage() {
  const [jobReference, setJobReference] = useState('')
  const [vehicleRegistration, setVehicleRegistration] = useState('')
  const [error, setError] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [assignedJobs, setAssignedJobs] = useState<Job[]>([])
  const [assignedLoading, setAssignedLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchAssignedJobs = async () => {
      if (!user) {
        setAssignedJobs([])
        setAssignedLoading(false)
        return
      }

      setAssignedLoading(true)

      try {
        const jobsRef = collection(db, 'jobs')
        const q = query(jobsRef, where('driverId', '==', user.uid))
        const snapshot = await getDocs(q)
        const jobsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Job))
        setAssignedJobs(jobsData)
      } catch (err) {
        console.error('Error fetching assigned jobs:', err)
      } finally {
        setAssignedLoading(false)
      }
    }

    fetchAssignedJobs()
  }, [user])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSearching(true)

    try {
      const jobsRef = collection(db, 'jobs')
      const q = query(
        jobsRef,
        where('jobReference', '==', jobReference.trim()),
        where('vehicleRegistration', '==', vehicleRegistration.trim().toUpperCase())
      )
      
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        setError('No job found with the provided reference and registration. Please check and try again.')
        setIsSearching(false)
        return
      }

      const jobDoc = querySnapshot.docs[0]
      const jobData = { id: jobDoc.id, ...jobDoc.data() } as Job
      const activeSignups = assignedJobs.filter(
        (job) => !(job.collectionFormStatus === 'sent' && job.deliveryFormStatus === 'sent')
      ).length

      if (jobData.driverId && jobData.driverId !== user?.uid) {
        setError('This job is already assigned to another driver.')
        setIsSearching(false)
        return
      }

      if (!jobData.driverId && activeSignups >= 2) {
        setError('You already have 2 active signed-up jobs. Complete one before signing up for another.')
        setIsSearching(false)
        return
      }

      router.push(`/driver-portal/job/${jobDoc.id}`)
    } catch (err) {
      console.error('Error searching for job:', err)
      setError('An error occurred while searching. Please try again.')
      setIsSearching(false)
    }
  }

  const activeAssignedCount = assignedJobs.filter(
    (job) => !(job.collectionFormStatus === 'sent' && job.deliveryFormStatus === 'sent')
  ).length

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <PortalHeader title="Find Job" />
        
        <main className="flex-1 p-4">
          {assignedLoading ? (
            <div className="max-w-md mx-auto mt-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-black" />
            </div>
          ) : (
            <Card className="max-w-4xl mx-auto mt-8 border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-black">Your Signed-Up Jobs</CardTitle>
                <p className="text-sm text-muted-foreground">
                  You are currently signed up to {activeAssignedCount} active job{activeAssignedCount === 1 ? '' : 's'}.
                </p>
              </CardHeader>
              <CardContent>
                {assignedJobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">You have not signed up for any jobs yet.</p>
                ) : (
                  <div className="space-y-3">
                    {assignedJobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{job.jobReference}</p>
                            <p className="text-sm text-muted-foreground">{job.vehicleRegistration}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p className={job.collectionFormStatus === 'sent' ? 'text-green-600' : 'text-muted-foreground'}>
                              {job.collectionFormStatus === 'sent' ? 'Collection sent' : 'Collection pending'}
                            </p>
                            <p className={job.deliveryFormStatus === 'sent' ? 'text-green-600' : 'text-muted-foreground'}>
                              {job.deliveryFormStatus === 'sent' ? 'Delivery sent' : 'Delivery pending'}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="mt-3"
                          onClick={() => router.push(`/driver-portal/job/${job.id}`)}
                        >
                          View Job
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="max-w-md mx-auto mt-8 border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-center text-black">
                Enter Job Details
              </CardTitle>
              <p className="text-center text-muted-foreground text-sm">
                Enter the job reference number and vehicle registration to access the forms.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobReference">Job Reference</Label>
                  <Input
                    id="jobReference"
                    placeholder="e.g. x7pWsbUAuUUTyPiov2rW"
                    value={jobReference}
                    onChange={(e) => setJobReference(e.target.value)}
                    required
                    disabled={isSearching}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleRegistration">Vehicle Registration</Label>
                  <Input
                    id="vehicleRegistration"
                    placeholder="e.g. GM70ZTV"
                    value={vehicleRegistration}
                    onChange={(e) => setVehicleRegistration(e.target.value.toUpperCase())}
                    required
                    disabled={isSearching}
                    className="uppercase"
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-800 text-white"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Find Job
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}
