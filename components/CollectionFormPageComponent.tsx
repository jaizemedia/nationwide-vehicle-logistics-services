"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Job, FormData } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { YesNoToggle } from '@/components/driver-portal/yes-no-toggle';
import { PhotoUpload } from '@/components/driver-portal/photo-upload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TOTAL_STEPS = 11;

export function CollectionFormPageComponent({ jobId, readOnly = true }: { jobId: string, readOnly?: boolean }) {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchForm() {
      try {
        const formRef = doc(db, 'forms', `${jobId}_collection`);
        const formSnap = await getDoc(formRef);
        if (formSnap.exists()) {
          setFormData(formSnap.data() as FormData);
        } else {
          setFormData(null);
        }
        const jobRef = doc(db, 'jobs', jobId);
        const jobSnap = await getDoc(jobRef);
        if (jobSnap.exists()) {
          setJob({ id: jobSnap.id, ...jobSnap.data() } as Job);
        } else {
          setJob(null);
        }
      } catch (e) {
        setFormData(null);
        setJob(null);
      } finally {
        setLoading(false);
      }
    }
    fetchForm();
  }, [jobId]);

  if (loading || !formData || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // Render the same step-by-step UI as the driver portal, but all fields are read-only
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Mileage on collection</Label>
                <Input type="number" value={formData.mileage} readOnly disabled className="w-32 text-right" />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Fuel</Label>
                <Input value={formData.fuel} readOnly disabled className="w-32 text-right" />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Charge</Label>
                <Input value={formData.charge} readOnly disabled className="w-32 text-right" />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Number of Keys</Label>
                <Input type="number" value={formData.numberOfKeys} readOnly disabled className="w-32 text-right" />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Vehicle Delivery Pack</Label>
                <YesNoToggle value={formData.vehicleDeliveryPack} disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Locking Wheel Nut</Label>
                <YesNoToggle value={formData.lockingWheelNut} disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Number Plates present & match</Label>
                <YesNoToggle value={formData.numberPlatesMatch} disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Any warning lights on</Label>
                <YesNoToggle value={formData.warningLightsOn} disabled />
              </div>
              <div className="flex items-center justify-between py-3">
                <Label className="text-muted-foreground">Sat Nav working</Label>
                <YesNoToggle value={formData.satNavWorking} disabled />
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Headrests present</Label>
                <YesNoToggle value={formData.headrestsPresent} disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Parcel Shelf Present</Label>
                <YesNoToggle value={formData.parcelShelfPresent} disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Spare Wheel / Tyre inflation / Run Flats</Label>
                <YesNoToggle value={formData.spareWheelPresent} disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Jack</Label>
                <YesNoToggle value={formData.jackPresent} disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Tools</Label>
                <YesNoToggle value={formData.toolsPresent} disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Charging Cable(s)</Label>
                <YesNoToggle value={formData.chargingCablesPresent} disabled />
              </div>
              {formData.chargingCablesPresent && (
                <div className="flex items-center justify-between py-3 border-b">
                  <Label className="text-muted-foreground">If yes, number of charging cables</Label>
                  <Input type="number" value={formData.numberOfChargingCables} readOnly disabled className="w-32 text-right" />
                </div>
              )}
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">V5 (Registration document) present</Label>
                <YesNoToggle value={formData.v5DocumentPresent} disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Light</Label>
                <Input value={formData.light} readOnly disabled className="w-32 text-right" />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Weather</Label>
                <Input value={formData.weather} readOnly disabled className="w-32 text-right" />
              </div>
              <div className="py-3">
                <Label className="text-muted-foreground">Notes</Label>
                <Textarea value={formData.notes} readOnly disabled className="mt-2" />
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardContent className="pt-6">
              <PhotoUpload label="Photo taken of left hand side" photoKey="leftSide" photoUrl={formData.photoUrls?.leftSide} confirmed={formData.photoLeftSide} onConfirmChange={() => {}} onPhotoUpload={() => {}} disabled />
              <PhotoUpload label="Photo taken of right hand side" photoKey="rightSide" photoUrl={formData.photoUrls?.rightSide} confirmed={formData.photoRightSide} onConfirmChange={() => {}} onPhotoUpload={() => {}} disabled />
              <PhotoUpload label="Photo taken of front" photoKey="front" photoUrl={formData.photoUrls?.front} confirmed={formData.photoFront} onConfirmChange={() => {}} onPhotoUpload={() => {}} disabled />
              <PhotoUpload label="Photo taken of back" photoKey="back" photoUrl={formData.photoUrls?.back} confirmed={formData.photoBack} onConfirmChange={() => {}} onPhotoUpload={() => {}} disabled />
              <PhotoUpload label="Photo taken of dashboard" photoKey="dashboard" photoUrl={formData.photoUrls?.dashboard} confirmed={formData.photoDashboard} onConfirmChange={() => {}} onPhotoUpload={() => {}} disabled />
              <PhotoUpload label="Photo taken of keys" photoKey="keys" photoUrl={formData.photoUrls?.keys} confirmed={formData.photoKeys} onConfirmChange={() => {}} onPhotoUpload={() => {}} disabled />
              <PhotoUpload label="Photo taken of number plates" photoKey="numberPlates" photoUrl={formData.photoUrls?.numberPlates} confirmed={formData.photoNumberPlates} onConfirmChange={() => {}} onPhotoUpload={() => {}} disabled />
            </CardContent>
          </Card>
        );
      case 4:
      case 5:
      case 6:
      case 7:
        // Summary/confirmation steps - show read-only summary of data
        return (
          <Card>
            <CardContent className="pt-6 space-y-3">
              {/* Render summary fields as in driver portal */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Mileage on collection</span>
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
                {/* Add more summary fields as needed */}
              </div>
            </CardContent>
          </Card>
        );
      case 8:
        // Disclaimer step
        return (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed text-justify">
                If the vehicle is inspected in poor weather conditions, or is excessively soiled, it may not be possible to produce an accurate inspection report. In such instances the right is reserved to recharge for any damage not recorded at the time of hand over. Any missing items will also be rechargeable. By signing this document, you are agreeing that as far as you are aware all personal, business and professional items have been removed, you agree with the recorded details of the vehicle condition and the stated mileage is correct. I confirm that I agree with the details recorded.
              </p>
              <div className="flex items-center space-x-2 mt-6">
                <input type="checkbox" checked={formData.agreedWithInfo === true} readOnly disabled />
                <label className="text-sm text-muted-foreground cursor-pointer">
                  *By selecting confirm you agree to the above disclaimer.
                </label>
              </div>
            </CardContent>
          </Card>
        );
      case 9:
        // Customer signature step
        return (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label className="text-muted-foreground">Customer Name</Label>
                <Input value={formData.customerName} readOnly disabled className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">Company</Label>
                <Input value={formData.customerCompany} readOnly disabled className="mt-1" />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground text-sm">
                  Have you been shown the details recorded by the driver?
                </Label>
                <YesNoToggle value={formData.customerShownDetails} disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground text-sm">
                  Are you signing for this vehicle on behalf of someone else?
                </Label>
                <YesNoToggle value={formData.signingOnBehalf} disabled />
              </div>
              {formData.signingOnBehalf && (
                <div>
                  <Label className="text-muted-foreground">Signed for by</Label>
                  <Input value={formData.signedForBy} readOnly disabled className="mt-1" />
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Customer Signature</Label>
                <Input value={formData.customerSignature} readOnly disabled className="mt-1" />
              </div>
            </CardContent>
          </Card>
        );
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
        );
      case 11:
        // Driver signature step
        return (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label className="text-muted-foreground">Driver Name</Label>
                <Input value={formData.driverName} readOnly disabled className="mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground">Driver Signature</Label>
                <Input value={formData.driverSignature} readOnly disabled className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Estimated time of arrival</Label>
                  <Input type="date" value={formData.estimatedArrivalDate} readOnly disabled className="mt-1" />
                </div>
                <div>
                  <Label className="text-muted-foreground">&nbsp;</Label>
                  <Input type="time" value={formData.estimatedArrivalTime} readOnly disabled className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Agent notes</Label>
                <Textarea value={formData.agentNotes} readOnly disabled className="mt-1" />
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <div className="px-4 py-2 flex items-center justify-between bg-white mx-2 mt-2 rounded-lg">
        <span className="text-sm font-medium">Step {currentStep}/{TOTAL_STEPS}</span>
        <button className="p-2" disabled>
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
      <main className="flex-1 p-4">
        {renderStep()}
      </main>
      <div className="flex justify-between p-4">
        <button
          className="btn"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button
          className="btn"
          onClick={() => setCurrentStep(Math.min(TOTAL_STEPS, currentStep + 1))}
          disabled={currentStep === TOTAL_STEPS}
        >
          Next
        </button>
      </div>
    </div>
  );
}
