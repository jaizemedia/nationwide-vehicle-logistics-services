'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'
import type { Job, FormData } from '@/lib/types'
import { DEFAULT_FORM_DATA } from '@/lib/types'
import { AuthGuard } from '@/components/driver-portal/auth-guard'
import { PortalHeader } from '@/components/driver-portal/portal-header'
import { FormNavigation } from '@/components/driver-portal/form-navigation'
import { YesNoToggle } from '@/components/driver-portal/yes-no-toggle'
import { SignaturePad } from '@/components/driver-portal/signature-pad'
import { PhotoUpload } from '@/components/driver-portal/photo-upload'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Image as ImageIcon } from 'lucide-react'

const TOTAL_STEPS = 11

export default function DeliveryFormPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  
  const [job, setJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job
        const jobRef = doc(db, 'jobs', jobId)
        const jobSnap = await getDoc(jobRef)
        
        if (!jobSnap.exists()) {
          router.push('/driver-portal/lookup')
          return
        }

        const jobData = { id: jobSnap.id, ...jobSnap.data() } as Job
        setJob(jobData)

        if (!jobData.driverId || jobData.driverId !== user?.uid) {
          router.push(`/driver-portal/job/${jobId}`)
          return
        }

        // Check if collection is complete - if not, redirect back
        if (jobData.collectionFormStatus !== 'sent') {
          router.push(`/driver-portal/job/${jobId}`)
          return
        }

        // Check if form is read-only
        if (jobData.deliveryFormStatus === 'sent') {
          setIsReadOnly(true)
        }

        // Fetch or initialize form data
        const formRef = doc(db, 'forms', `${jobId}_delivery`)
        const formSnap = await getDoc(formRef)

        if (formSnap.exists()) {
          setFormData(formSnap.data() as FormData)
        } else {
          const newFormData: FormData = {
            ...DEFAULT_FORM_DATA,
            jobId,
            formType: 'delivery',
            driverId: user?.uid || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          setFormData(newFormData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [jobId, user, router])

  const updateFormField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    if (isReadOnly) return
    setFormData((prev) => prev ? { ...prev, [field]: value } : null)
  }

  const updatePhotoUrl = (key: string, url: string) => {
    if (isReadOnly) return
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        photoUrls: { ...prev.photoUrls, [key]: url },
      }
    })
  }

  const saveProgress = async () => {
    if (!formData || isReadOnly) return

    try {
      const formRef = doc(db, 'forms', `${jobId}_delivery`)
      await setDoc(formRef, {
        ...formData,
        status: 'in-progress',
        updatedAt: new Date().toISOString(),
      })

      // Update job status
      const jobRef = doc(db, 'jobs', jobId)
      await updateDoc(jobRef, {
        deliveryFormStatus: 'in-progress',
        updatedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  const handleSubmit = async () => {
    if (!formData || isReadOnly) return

    setIsSubmitting(true)
    try {
      const formRef = doc(db, 'forms', `${jobId}_delivery`)
      await setDoc(formRef, {
        ...formData,
        status: 'sent',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // Update job status
      const jobRef = doc(db, 'jobs', jobId)
      await updateDoc(jobRef, {
        deliveryFormStatus: 'sent',
        updatedAt: new Date().toISOString(),
      })

      router.push(`/driver-portal/job/${jobId}`)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const goToStep = (step: number) => {
    saveProgress()
    setCurrentStep(step)
  }

  if (loading || !formData || !job) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </AuthGuard>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Mileage on delivery</Label>
                <Input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => updateFormField('mileage', e.target.value)}
                  className="w-32 text-right"
                  placeholder="0"
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Fuel</Label>
                <Select
                  value={formData.fuel}
                  onValueChange={(v) => updateFormField('fuel', v)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empty">Empty</SelectItem>
                    <SelectItem value="1/4">1/4</SelectItem>
                    <SelectItem value="1/2">1/2</SelectItem>
                    <SelectItem value="3/4">3/4</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Charge</Label>
                <Select
                  value={formData.charge}
                  onValueChange={(v) => updateFormField('charge', v)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N/A">N/A</SelectItem>
                    <SelectItem value="0-25%">0-25%</SelectItem>
                    <SelectItem value="25-50%">25-50%</SelectItem>
                    <SelectItem value="50-75%">50-75%</SelectItem>
                    <SelectItem value="75-100%">75-100%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Number of Keys</Label>
                <Input
                  type="number"
                  value={formData.numberOfKeys}
                  onChange={(e) => updateFormField('numberOfKeys', e.target.value)}
                  className="w-32 text-right"
                  placeholder="0"
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Vehicle Delivery Pack</Label>
                <YesNoToggle
                  value={formData.vehicleDeliveryPack}
                  onChange={(v) => updateFormField('vehicleDeliveryPack', v)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Locking Wheel Nut</Label>
                <YesNoToggle
                  value={formData.lockingWheelNut}
                  onChange={(v) => updateFormField('lockingWheelNut', v)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Number Plates present & match</Label>
                <YesNoToggle
                  value={formData.numberPlatesMatch}
                  onChange={(v) => updateFormField('numberPlatesMatch', v)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Any warning lights on</Label>
                <YesNoToggle
                  value={formData.warningLightsOn}
                  onChange={(v) => updateFormField('warningLightsOn', v)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <Label className="text-muted-foreground">Sat Nav working</Label>
                <YesNoToggle
                  value={formData.satNavWorking}
                  onChange={(v) => updateFormField('satNavWorking', v)}
                  disabled={isReadOnly}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Headrests present</Label>
                <YesNoToggle
                  value={formData.headrestsPresent}
                  onChange={(v) => updateFormField('headrestsPresent', v)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Parcel Shelf Present</Label>
                <YesNoToggle
                  value={formData.parcelShelfPresent}
                  onChange={(v) => updateFormField('parcelShelfPresent', v)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Spare Wheel / Tyre inflation / Run Flats</Label>
                <YesNoToggle
                  value={formData.spareWheelPresent}
                  onChange={(v) => updateFormField('spareWheelPresent', v)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Jack</Label>
                <YesNoToggle
                  value={formData.jackPresent}
                  onChange={(v) => updateFormField('jackPresent', v)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Tools</Label>
                <YesNoToggle
                  value={formData.toolsPresent}
                  onChange={(v) => updateFormField('toolsPresent', v)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Charging Cable(s)</Label>
                <YesNoToggle
                  value={formData.chargingCablesPresent}
                  onChange={(v) => updateFormField('chargingCablesPresent', v)}
                  disabled={isReadOnly}
                />
              </div>

              {formData.chargingCablesPresent && (
                <div className="flex items-center justify-between py-3 border-b">
                  <Label className="text-muted-foreground">If yes, number of charging cables</Label>
                  <Input
                    type="number"
                    value={formData.numberOfChargingCables}
                    onChange={(e) => updateFormField('numberOfChargingCables', e.target.value)}
                    className="w-32 text-right"
                    placeholder="Optional"
                    disabled={isReadOnly}
                  />
                </div>
              )}

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">V5 (Registration document) present</Label>
                <YesNoToggle
                  value={formData.v5DocumentPresent}
                  onChange={(v) => updateFormField('v5DocumentPresent', v)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Light</Label>
                <Select
                  value={formData.light}
                  onValueChange={(v) => updateFormField('light', v)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                    <SelectItem value="Dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Weather</Label>
                <Select
                  value={formData.weather}
                  onValueChange={(v) => updateFormField('weather', v)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dry">Dry</SelectItem>
                    <SelectItem value="Wet">Wet</SelectItem>
                    <SelectItem value="Snow">Snow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="py-3">
                <Label className="text-muted-foreground">Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => updateFormField('notes', e.target.value)}
                  placeholder="Add any additional notes..."
                  className="mt-2"
                  disabled={isReadOnly}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardContent className="pt-6">
              <PhotoUpload
                label="Photo taken of left hand side"
                photoKey="leftSide"
                photoUrl={formData.photoUrls?.leftSide}
                confirmed={formData.photoLeftSide}
                onConfirmChange={(v) => updateFormField('photoLeftSide', v)}
                onPhotoUpload={updatePhotoUrl}
                disabled={isReadOnly}
              />
              <PhotoUpload
                label="Photo taken of right hand side"
                photoKey="rightSide"
                photoUrl={formData.photoUrls?.rightSide}
                confirmed={formData.photoRightSide}
                onConfirmChange={(v) => updateFormField('photoRightSide', v)}
                onPhotoUpload={updatePhotoUrl}
                disabled={isReadOnly}
              />
              <PhotoUpload
                label="Photo taken of front"
                photoKey="front"
                photoUrl={formData.photoUrls?.front}
                confirmed={formData.photoFront}
                onConfirmChange={(v) => updateFormField('photoFront', v)}
                onPhotoUpload={updatePhotoUrl}
                disabled={isReadOnly}
              />
              <PhotoUpload
                label="Photo taken of back"
                photoKey="back"
                photoUrl={formData.photoUrls?.back}
                confirmed={formData.photoBack}
                onConfirmChange={(v) => updateFormField('photoBack', v)}
                onPhotoUpload={updatePhotoUrl}
                disabled={isReadOnly}
              />
              <PhotoUpload
                label="Photo taken of dashboard"
                photoKey="dashboard"
                photoUrl={formData.photoUrls?.dashboard}
                confirmed={formData.photoDashboard}
                onConfirmChange={(v) => updateFormField('photoDashboard', v)}
                onPhotoUpload={updatePhotoUrl}
                disabled={isReadOnly}
              />
              <PhotoUpload
                label="Photo taken of keys"
                photoKey="keys"
                photoUrl={formData.photoUrls?.keys}
                confirmed={formData.photoKeys}
                onConfirmChange={(v) => updateFormField('photoKeys', v)}
                onPhotoUpload={updatePhotoUrl}
                disabled={isReadOnly}
              />
              <PhotoUpload
                label="Photo taken of number plates"
                photoKey="numberPlates"
                photoUrl={formData.photoUrls?.numberPlates}
                confirmed={formData.photoNumberPlates}
                onConfirmChange={(v) => updateFormField('photoNumberPlates', v)}
                onPhotoUpload={updatePhotoUrl}
                disabled={isReadOnly}
              />
            </CardContent>
          </Card>
        )

      case 4:
      case 5:
      case 6:
      case 7:
        // Summary/confirmation steps
        return (
          <Card>
            <CardContent className="pt-6 space-y-3">
              {currentStep === 4 && (
                <>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Mileage on delivery</span>
                    <span>{formData.mileage || '-'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Charge</span>
                    <span>{formData.charge || '-'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Fuel</span>
                    <span>{formData.fuel || '-'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Number of Keys</span>
                    <span>{formData.numberOfKeys || '-'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Vehicle Delivery Pack</span>
                    <span>{formData.vehicleDeliveryPack === null ? '-' : formData.vehicleDeliveryPack ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Number Plates present & match</span>
                    <span>{formData.numberPlatesMatch === null ? '-' : formData.numberPlatesMatch ? 'Yes' : 'No'}</span>
                  </div>
                </>
              )}
              {currentStep === 5 && (
                <>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Locking Wheel Nut</span>
                    <span>{formData.lockingWheelNut === null ? '-' : formData.lockingWheelNut ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Any warning lights on</span>
                    <span>{formData.warningLightsOn === null ? '-' : formData.warningLightsOn ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Sat Nav working</span>
                    <span>{formData.satNavWorking === null ? '-' : formData.satNavWorking ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Headrests present</span>
                    <span>{formData.headrestsPresent === null ? '-' : formData.headrestsPresent ? 'Yes' : 'No'}</span>
                  </div>
                </>
              )}
              {currentStep === 6 && (
                <>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Photo taken of left hand side</span>
                    <span>{formData.photoLeftSide === null ? '-' : formData.photoLeftSide ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Photo taken of right hand side</span>
                    <span>{formData.photoRightSide === null ? '-' : formData.photoRightSide ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Photo taken of front</span>
                    <span>{formData.photoFront === null ? '-' : formData.photoFront ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Photo taken of back</span>
                    <span>{formData.photoBack === null ? '-' : formData.photoBack ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Photo taken of dashboard</span>
                    <span>{formData.photoDashboard === null ? '-' : formData.photoDashboard ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Photo taken of keys</span>
                    <span>{formData.photoKeys === null ? '-' : formData.photoKeys ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Photo taken of number plates</span>
                    <span>{formData.photoNumberPlates === null ? '-' : formData.photoNumberPlates ? 'Yes' : 'No'}</span>
                  </div>
                </>
              )}
              {currentStep === 7 && (
                <>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Spare Wheel / Tyre inflation / Run Flats</span>
                    <span>{formData.spareWheelPresent === null ? '-' : formData.spareWheelPresent ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Jack</span>
                    <span>{formData.jackPresent === null ? '-' : formData.jackPresent ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Tools</span>
                    <span>{formData.toolsPresent === null ? '-' : formData.toolsPresent ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Charging Cable(s)</span>
                    <span>{formData.chargingCablesPresent === null ? '-' : formData.chargingCablesPresent ? 'Yes' : 'No'}</span>
                  </div>
                  {formData.chargingCablesPresent && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">If yes, number of charging cables</span>
                      <span>{formData.numberOfChargingCables || '-'}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Parcel Shelf Present</span>
                    <span>{formData.parcelShelfPresent === null ? '-' : formData.parcelShelfPresent ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">V5 (Registration document) present</span>
                    <span>{formData.v5DocumentPresent === null ? '-' : formData.v5DocumentPresent ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Light</span>
                    <span>{formData.light || '-'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Weather</span>
                    <span>{formData.weather || '-'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Notes</span>
                    <span className="text-right max-w-[200px] truncate">{formData.notes || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Do you agree with the above information?</span>
                    <YesNoToggle
                      value={formData.agreedWithInfo}
                      onChange={(v) => updateFormField('agreedWithInfo', v)}
                      disabled={isReadOnly}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )

      case 8:
        // Disclaimer step
        return (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed text-justify">
                If the vehicle is inspected in poor weather conditions, or is excessively soiled, it may not be possible to produce an accurate inspection report. In such instances the right is reserved to recharge for any damage not recorded at the time of hand over. Any missing items will also be rechargeable. By signing this document, you are agreeing that as far as you are aware all personal, business and professional items have been removed, you agree with the recorded details of the vehicle condition and the stated mileage is correct. I confirm that I agree with the details recorded.
              </p>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="disclaimer"
                  checked={formData.agreedWithInfo === true}
                  onCheckedChange={(checked) => updateFormField('agreedWithInfo', checked === true)}
                  disabled={isReadOnly}
                />
                <label
                  htmlFor="disclaimer"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  *By selecting confirm you agree to the above disclaimer.
                </label>
              </div>
            </CardContent>
          </Card>
        )

      case 9:
        // Customer signature step
        return (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label className="text-muted-foreground">Customer Name</Label>
                <Input
                  value={formData.customerName}
                  onChange={(e) => updateFormField('customerName', e.target.value)}
                  placeholder="Enter name"
                  className="mt-1"
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <Label className="text-muted-foreground">Company</Label>
                <Input
                  value={formData.customerCompany}
                  onChange={(e) => updateFormField('customerCompany', e.target.value)}
                  placeholder="CC"
                  className="mt-1"
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground text-sm">
                  Have you been shown the details recorded by the driver?
                </Label>
                <YesNoToggle
                  value={formData.customerShownDetails}
                  onChange={(v) => updateFormField('customerShownDetails', v)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground text-sm">
                  Are you signing for this vehicle on behalf of someone else?
                </Label>
                <YesNoToggle
                  value={formData.signingOnBehalf}
                  onChange={(v) => updateFormField('signingOnBehalf', v)}
                  disabled={isReadOnly}
                />
              </div>

              {formData.signingOnBehalf && (
                <div>
                  <Label className="text-muted-foreground">Signed for by</Label>
                  <Input
                    value={formData.signedForBy}
                    onChange={(e) => updateFormField('signedForBy', e.target.value)}
                    placeholder="Name of person signing"
                    className="mt-1"
                    disabled={isReadOnly}
                  />
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Customer Signature</Label>
                <SignaturePad
                  value={formData.customerSignature}
                  onChange={(v) => updateFormField('customerSignature', v)}
                  timestamp={formData.customerSignatureTimestamp}
                  onTimestampChange={(t) => updateFormField('customerSignatureTimestamp', t)}
                  disabled={isReadOnly}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 10:
        // Handover prompt
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-24 h-24 mb-6 text-muted-foreground">
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="20" y="10" width="60" height="80" rx="2" />
                    <path d="M50 70 L30 85 L35 70 L30 55 Z" />
                    <path d="M55 60 Q70 55 75 65 Q80 75 65 80" />
                  </svg>
                </div>
                <p className="text-lg text-muted-foreground">
                  Please hand the device back to the delivery agent
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 11:
        // Driver signature step
        return (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label className="text-muted-foreground">Driver Name</Label>
                <Input
                  value={formData.driverName}
                  onChange={(e) => updateFormField('driverName', e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1"
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <Label className="text-muted-foreground">Driver Signature</Label>
                <SignaturePad
                  value={formData.driverSignature}
                  onChange={(v) => updateFormField('driverSignature', v)}
                  timestamp={formData.driverSignatureTimestamp}
                  onTimestampChange={(t) => updateFormField('driverSignatureTimestamp', t)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Completion date</Label>
                  <Input
                    type="date"
                    value={formData.estimatedArrivalDate}
                    onChange={(e) => updateFormField('estimatedArrivalDate', e.target.value)}
                    className="mt-1"
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">&nbsp;</Label>
                  <Input
                    type="time"
                    value={formData.estimatedArrivalTime}
                    onChange={(e) => updateFormField('estimatedArrivalTime', e.target.value)}
                    className="mt-1"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Agent notes</Label>
                <Textarea
                  value={formData.agentNotes}
                  onChange={(e) => updateFormField('agentNotes', e.target.value)}
                  placeholder="Add any additional notes..."
                  className="mt-1"
                  disabled={isReadOnly}
                />
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    if (currentStep === 8) return 'Disclaimer'
    return `Step ${currentStep}/${TOTAL_STEPS}`
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col pb-20">
        <PortalHeader
          title="Delivery"
          showBack
          backHref={`/driver-portal/job/${jobId}`}
          job={job}
        />

        <div className="px-4 py-2 flex items-center justify-between bg-white mx-2 mt-2 rounded-lg">
          <span className="text-sm font-medium">{getStepTitle()}</span>
          <button className="p-2">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <main className="flex-1 p-4">
          {isReadOnly && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm text-center">
              This form has been submitted and is now read-only.
            </div>
          )}
          {renderStep()}
        </main>

        <FormNavigation
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onPrevious={() => goToStep(currentStep - 1)}
          onNext={() => goToStep(currentStep + 1)}
          onCancel={() => router.push(`/driver-portal/job/${jobId}`)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          canGoNext={!isReadOnly || currentStep < TOTAL_STEPS}
          jobId={jobId}
        />
      </div>
    </AuthGuard>
  )
}
