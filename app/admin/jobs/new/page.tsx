'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import type { Job } from '@/lib/types'

export default function NewJobPage() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    jobReference: '',
    vehicleRegistration: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    chassisNumber: '',
    requiredDeliveryDate: '',
    collectionAddress: '',
    collectionPostcode: '',
    collectionTelephone: '',
    collectionTelephone2: '',
    collectionName: '',
    deliveryAddress: '',
    deliveryPostcode: '',
    deliveryTelephone: '',
    deliveryTelephone2: '',
    deliveryName: '',
    specialNotes: '',
    jobProviderNotes: ''
  })

  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || authLoading) return

    if (!user || !isAdmin) {
      router.push('/admin')
    }
  }, [mounted, authLoading, user, isAdmin, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const jobData: Omit<Job, 'id'> = {
        ...formData,
        collectionFormStatus: 'new',
        deliveryFormStatus: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const docRef = await addDoc(collection(db, 'jobs'), jobData)
      router.push(`/admin/jobs/${docRef.id}`)
    } catch (error) {
      console.error('Error creating job:', error)
      alert('Failed to create job. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted || authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
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
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Create New Job</h1>
                <p className="text-sm text-white/80">Add a new vehicle logistics job</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobReference">Job Reference *</Label>
                  <Input
                    id="jobReference"
                    value={formData.jobReference}
                    onChange={(e) => handleInputChange('jobReference', e.target.value)}
                    placeholder="CVLS-2024-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requiredDeliveryDate">Required Delivery Date *</Label>
                  <Input
                    id="requiredDeliveryDate"
                    type="date"
                    value={formData.requiredDeliveryDate}
                    onChange={(e) => handleInputChange('requiredDeliveryDate', e.target.value)}
                    required
                  />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleRegistration">Registration *</Label>
                  <Input
                    id="vehicleRegistration"
                    value={formData.vehicleRegistration}
                    onChange={(e) => handleInputChange('vehicleRegistration', e.target.value)}
                    placeholder="AB12 CDE"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleMake">Make *</Label>
                  <Input
                    id="vehicleMake"
                    value={formData.vehicleMake}
                    onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                    placeholder="Toyota"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Model *</Label>
                  <Input
                    id="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                    placeholder="Corolla"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleColor">Color *</Label>
                  <Input
                    id="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={(e) => handleInputChange('vehicleColor', e.target.value)}
                    placeholder="Blue"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="chassisNumber">Chassis Number *</Label>
                  <Input
                    id="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={(e) => handleInputChange('chassisNumber', e.target.value)}
                    placeholder="VIN or Chassis Number"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collection Details */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collectionName">Contact Name *</Label>
                <Input
                  id="collectionName"
                  value={formData.collectionName}
                  onChange={(e) => handleInputChange('collectionName', e.target.value)}
                  placeholder="John Smith"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collectionAddress">Address *</Label>
                <Textarea
                  id="collectionAddress"
                  value={formData.collectionAddress}
                  onChange={(e) => handleInputChange('collectionAddress', e.target.value)}
                  placeholder="123 Main Street, City, County"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="collectionPostcode">Postcode *</Label>
                  <Input
                    id="collectionPostcode"
                    value={formData.collectionPostcode}
                    onChange={(e) => handleInputChange('collectionPostcode', e.target.value)}
                    placeholder="SW1A 1AA"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectionTelephone">Telephone *</Label>
                  <Input
                    id="collectionTelephone"
                    value={formData.collectionTelephone}
                    onChange={(e) => handleInputChange('collectionTelephone', e.target.value)}
                    placeholder="01234 567890"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectionTelephone2">Telephone 2</Label>
                  <Input
                    id="collectionTelephone2"
                    value={formData.collectionTelephone2}
                    onChange={(e) => handleInputChange('collectionTelephone2', e.target.value)}
                    placeholder="07900 123456"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Details */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryName">Contact Name *</Label>
                <Input
                  id="deliveryName"
                  value={formData.deliveryName}
                  onChange={(e) => handleInputChange('deliveryName', e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Address *</Label>
                <Textarea
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  placeholder="456 High Street, Town, County"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryPostcode">Postcode *</Label>
                  <Input
                    id="deliveryPostcode"
                    value={formData.deliveryPostcode}
                    onChange={(e) => handleInputChange('deliveryPostcode', e.target.value)}
                    placeholder="N1 1AA"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryTelephone">Telephone *</Label>
                  <Input
                    id="deliveryTelephone"
                    value={formData.deliveryTelephone}
                    onChange={(e) => handleInputChange('deliveryTelephone', e.target.value)}
                    placeholder="01234 567890"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryTelephone2">Telephone 2</Label>
                  <Input
                    id="deliveryTelephone2"
                    value={formData.deliveryTelephone2}
                    onChange={(e) => handleInputChange('deliveryTelephone2', e.target.value)}
                    placeholder="07900 123456"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specialNotes">Special Notes</Label>
                <Textarea
                  id="specialNotes"
                  value={formData.specialNotes}
                  onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                  placeholder="Any special handling instructions..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobProviderNotes">Job Provider Notes</Label>
                <Textarea
                  id="jobProviderNotes"
                  value={formData.jobProviderNotes}
                  onChange={(e) => handleInputChange('jobProviderNotes', e.target.value)}
                  placeholder="Internal notes for the job provider..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-black hover:bg-neutral-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Job...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Job
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}