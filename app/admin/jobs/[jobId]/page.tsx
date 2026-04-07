'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft, Edit, Trash2, Truck, MapPin, Phone, User } from 'lucide-react'
import Link from 'next/link'
import type { Job, FormData } from '@/lib/types'

export default function JobDetailPage() {
  const [mounted, setMounted] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
  const [forms, setForms] = useState<FormData[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const jobId = params.jobId as string

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || authLoading) return

    if (!user || !isAdmin) {
      router.push('/admin')
      return
    }

    fetchJob()
  }, [mounted, authLoading, user, isAdmin, jobId, router])

  const fetchJob = async () => {
    if (!jobId) return

    try {
      const jobDoc = await getDoc(doc(db, 'jobs', jobId))
      if (jobDoc.exists()) {
        setJob({ id: jobDoc.id, ...jobDoc.data() } as Job)

        // Fetch associated forms
        const formsQuery = query(collection(db, 'forms'), where('jobId', '==', jobId))
        const formsSnapshot = await getDocs(formsQuery)
        const formsData = formsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FormData[]
        setForms(formsData)
      } else {
        router.push('/admin/dashboard')
      }
    } catch (error) {
      console.error('Error fetching job:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async () => {
    if (!job || !confirm('Are you sure you want to delete this job? This action cannot be undone.')) return

    setDeleting(true)
    try {
      // Delete associated forms first
      for (const form of forms) {
        if (!form.id) continue
        await deleteDoc(doc(db, 'forms', form.id))
      }

      // Delete the job
      await deleteDoc(doc(db, 'jobs', jobId))
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Failed to delete job. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
    }
  }

  if (!mounted || authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
          <Link href="/admin/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to the Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Job Details</h1>
                <p className="text-sm text-white/80">{job.jobReference}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/jobs/${jobId}/edit`}>
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteJob}
                disabled={deleting}
                className="border-red-300 text-red-100 hover:bg-red-600"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Job Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Job Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Job Reference</Label>
                    <p className="text-lg font-semibold">{job.jobReference}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Delivery Date</Label>
                    <p className="text-lg">{new Date(job.requiredDeliveryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Registration</Label>
                    <p className="text-lg font-mono bg-yellow-400 text-black px-2 py-1 rounded inline-block">
                      {job.vehicleRegistration}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Make & Model</Label>
                    <p className="text-lg">{job.vehicleMake} {job.vehicleModel}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Color</Label>
                    <p className="text-lg">{job.vehicleColor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Chassis Number</Label>
                    <p className="text-sm font-mono">{job.chassisNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collection Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Collection Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Contact</Label>
                  <p className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {job.collectionName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                  <p className="whitespace-pre-line">{job.collectionAddress}</p>
                  <p className="text-muted-foreground">{job.collectionPostcode}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Telephone
                    </Label>
                    <p>{job.collectionTelephone}</p>
                  </div>
                  {job.collectionTelephone2 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Telephone 2</Label>
                      <p>{job.collectionTelephone2}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Contact</Label>
                  <p className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {job.deliveryName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                  <p className="whitespace-pre-line">{job.deliveryAddress}</p>
                  <p className="text-muted-foreground">{job.deliveryPostcode}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Telephone
                    </Label>
                    <p>{job.deliveryTelephone}</p>
                  </div>
                  {job.deliveryTelephone2 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Telephone 2</Label>
                      <p>{job.deliveryTelephone2}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {(job.specialNotes || job.jobProviderNotes) && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.specialNotes && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Special Notes</Label>
                      <p className="whitespace-pre-line">{job.specialNotes}</p>
                    </div>
                  )}
                  {job.jobProviderNotes && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Job Provider Notes</Label>
                      <p className="whitespace-pre-line">{job.jobProviderNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Status Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Collection Form</Label>
                  <div className="mt-1">{getStatusBadge(job.collectionFormStatus)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Delivery Form</Label>
                  <div className="mt-1">{getStatusBadge(job.deliveryFormStatus)}</div>
                </div>
              </CardContent>
            </Card>

            {/* Forms Submitted */}
            {forms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Forms Submitted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {forms.map((form) => (
                      <div key={form.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm capitalize">{form.formType} Form</span>
                        {getStatusBadge(form.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/admin/jobs/${jobId}/edit`}>
                  <Button className="w-full" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Job
                  </Button>
                </Link>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.print()}
                >
                  Print Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}