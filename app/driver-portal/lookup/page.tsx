'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
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
  const router = useRouter()

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
      router.push(`/driver-portal/job/${jobDoc.id}`)
    } catch (err) {
      console.error('Error searching for job:', err)
      setError('An error occurred while searching. Please try again.')
      setIsSearching(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <PortalHeader title="Find Job" />
        
        <main className="flex-1 p-4">
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle className="text-center text-[#1a8a8a]">
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
                  className="w-full bg-[#1a8a8a] hover:bg-[#157070] text-white"
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
