'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { db } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { 
  Loader2, 
  Plus, 
  Truck, 
  Users, 
  ClipboardList, 
  LogOut,
  Trash2,
  Eye,
  Edit
} from 'lucide-react'
import Link from 'next/link'
import type { Job } from '@/lib/types'

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { user, isAdmin, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || authLoading) return

    if (!user || !isAdmin) {
      const redirectToLogin = async () => {
        if (user && !isAdmin) {
          await signOut()
        }
        router.push('/admin')
      }

      redirectToLogin()
    }
  }, [mounted, authLoading, user, isAdmin, router, signOut])

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user || !isAdmin) return
      
      try {
        const jobsRef = collection(db, 'jobs')
        const q = query(jobsRef, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        const jobsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Job[]
        setJobs(jobsData)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user && isAdmin) {
      fetchJobs()
    }
  }, [user])

  const handleDeleteJob = async () => {
    if (!deleteJobId) return
    
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'jobs', deleteJobId))
      setJobs(jobs.filter(job => job.id !== deleteJobId))
      setDeleteJobId(null)
    } catch (error) {
      console.error('Error deleting job:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800">Sent</Badge>
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">New</Badge>
    }
  }

  if (!mounted || authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a8a8a]" />
      </div>
    )
  }

  const stats = {
    totalJobs: jobs.length,
    pendingCollection: jobs.filter(j => j.collectionFormStatus !== 'sent').length,
    pendingDelivery: jobs.filter(j => j.collectionFormStatus === 'sent' && j.deliveryFormStatus !== 'sent').length,
    completed: jobs.filter(j => j.collectionFormStatus === 'sent' && j.deliveryFormStatus === 'sent').length,
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">CVLS Admin</h1>
                <p className="text-sm text-white/80">Job Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm hidden sm:block">{user.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Collection</CardTitle>
              <Truck className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingCollection}</div>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Delivery</CardTitle>
              <Truck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pendingDelivery}</div>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs Table */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Jobs</CardTitle>
            <Link href="/admin/jobs/new">
              <Button className="bg-black hover:bg-neutral-800">
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No jobs found. Create your first job to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Ref</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Registration</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Collection</TableHead>
                      <TableHead>Delivery</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.jobReference}</TableCell>
                        <TableCell>{job.vehicleMake} {job.vehicleModel}</TableCell>
                        <TableCell>
                          <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-medium">
                            {job.vehicleRegistration}
                          </span>
                        </TableCell>
                        <TableCell>{job.requiredDeliveryDate}</TableCell>
                        <TableCell>{getStatusBadge(job.collectionFormStatus)}</TableCell>
                        <TableCell>{getStatusBadge(job.deliveryFormStatus)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/jobs/${job.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/jobs/${job.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteJobId(job.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteJobId} onOpenChange={() => setDeleteJobId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job? This action cannot be undone and will remove all associated form data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteJob}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
