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
                <Label className="text-muted-foreground">Vehicle Collection Pack</Label>
                <YesNoToggle value={formData.vehicleCollectionPack} disabled readOnly />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Locking Wheel Nut</Label>
                <YesNoToggle value={formData.lockingWheelNut} disabled readOnly />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Number Plates present & match</Label>
                <YesNoToggle value={formData.numberPlatesMatch} disabled readOnly />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Any warning lights on</Label>
                <YesNoToggle value={formData.warningLightsOn} disabled readOnly />
              </div>
              <div className="flex items-center justify-between py-3">
                <Label className="text-muted-foreground">Sat Nav working</Label>
                <YesNoToggle value={formData.satNavWorking} disabled readOnly />
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
                <YesNoToggle value={formData.headrestsPresent} disabled readOnly />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Parcel Shelf Present</Label>
                <YesNoToggle value={formData.parcelShelfPresent} disabled readOnly />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Spare Wheel / Tyre inflation / Run Flats</Label>
                <YesNoToggle value={formData.spareWheelPresent} disabled readOnly />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Jack</Label>
                <YesNoToggle value={formData.jackPresent} disabled readOnly />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Tools</Label>
                <YesNoToggle value={formData.toolsPresent} disabled readOnly />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">Charging Cable(s)</Label>
                <YesNoToggle value={formData.chargingCablesPresent} disabled readOnly />
              </div>
              {formData.chargingCablesPresent && (
                <div className="flex items-center justify-between py-3 border-b">
                  <Label className="text-muted-foreground">If yes, number of charging cables</Label>
                  <Input type="number" value={formData.numberOfChargingCables} readOnly disabled className="w-32 text-right" />
                </div>
              )}
              <div className="flex items-center justify-between py-3 border-b">
                <Label className="text-muted-foreground">V5 (Registration document) present</Label>
                <YesNoToggle value={formData.v5DocumentPresent} disabled readOnly />
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
              <div className="space-y-4">
                <Label className="text-muted-foreground">Photos</Label>
                {formData.photoUrls?.leftSide && <img src={formData.photoUrls.leftSide} alt="Left Side" style={{maxWidth: 200}} />}
                {formData.photoUrls?.rightSide && <img src={formData.photoUrls.rightSide} alt="Right Side" style={{maxWidth: 200}} />}
                {formData.photoUrls?.front && <img src={formData.photoUrls.front} alt="Front" style={{maxWidth: 200}} />}
                {formData.photoUrls?.back && <img src={formData.photoUrls.back} alt="Back" style={{maxWidth: 200}} />}
                {formData.photoUrls?.dashboard && <img src={formData.photoUrls.dashboard} alt="Dashboard" style={{maxWidth: 200}} />}
                {formData.photoUrls?.keys && <img src={formData.photoUrls.keys} alt="Keys" style={{maxWidth: 200}} />}
                {formData.photoUrls?.numberPlates && <img src={formData.photoUrls.numberPlates} alt="Number Plates" style={{maxWidth: 200}} />}
              </div>
            </CardContent>
          </Card>
        );
      // Add more cases for summary, signatures, etc. as needed
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
        <button className="btn" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>Previous</button>
        <button className="btn" onClick={() => setCurrentStep(Math.min(TOTAL_STEPS, currentStep + 1))} disabled={currentStep === TOTAL_STEPS}>Next</button>
      </div>
    </div>
  );
}
