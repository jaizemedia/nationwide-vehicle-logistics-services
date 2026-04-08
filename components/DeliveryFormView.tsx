"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Job, FormData } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function DeliveryFormView({ jobId, readOnly = true }: { jobId: string, readOnly?: boolean }) {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchForm() {
      try {
        const formRef = doc(db, 'forms', `${jobId}_delivery`);
        const formSnap = await getDoc(formRef);
        if (formSnap.exists()) {
          setFormData(formSnap.data() as FormData);
        } else {
          setFormData(null);
        }
      } catch (e) {
        setFormData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchForm();
  }, [jobId]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!formData) return <div className="text-center py-12">No delivery form found.</div>;

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardContent className="space-y-4">
        <div><Label>Mileage:</Label> {formData.mileage}</div>
        <div><Label>Fuel:</Label> {formData.fuel}</div>
        <div><Label>Charge:</Label> {formData.charge}</div>
        <div><Label>Number of Keys:</Label> {formData.numberOfKeys}</div>
        <div><Label>Vehicle Delivery Pack:</Label> {formData.vehicleDeliveryPack ? 'Yes' : 'No'}</div>
        <div><Label>Locking Wheel Nut:</Label> {formData.lockingWheelNut ? 'Yes' : 'No'}</div>
        <div><Label>Number Plates present & match:</Label> {formData.numberPlatesMatch ? 'Yes' : 'No'}</div>
        <div><Label>Any warning lights on:</Label> {formData.warningLightsOn ? 'Yes' : 'No'}</div>
        <div><Label>Sat Nav working:</Label> {formData.satNavWorking ? 'Yes' : 'No'}</div>
        <div><Label>Headrests present:</Label> {formData.headrestsPresent ? 'Yes' : 'No'}</div>
        <div><Label>Parcel Shelf Present:</Label> {formData.parcelShelfPresent ? 'Yes' : 'No'}</div>
        <div><Label>Spare Wheel / Tyre inflation / Run Flats:</Label> {formData.spareWheelPresent ? 'Yes' : 'No'}</div>
        <div><Label>Jack:</Label> {formData.jackPresent ? 'Yes' : 'No'}</div>
        <div><Label>Tools:</Label> {formData.toolsPresent ? 'Yes' : 'No'}</div>
        <div><Label>Charging Cable(s):</Label> {formData.chargingCablesPresent ? 'Yes' : 'No'}</div>
        {formData.chargingCablesPresent && (
          <div><Label>Number of charging cables:</Label> {formData.numberOfChargingCables}</div>
        )}
        <div><Label>V5 (Registration document) present:</Label> {formData.v5DocumentPresent ? 'Yes' : 'No'}</div>
        <div><Label>Light:</Label> {formData.light}</div>
        <div><Label>Weather:</Label> {formData.weather}</div>
        <div><Label>Notes:</Label> {formData.notes}</div>
        <div><Label>Photo - Left Side:</Label> {formData.photoUrls?.leftSide && <img src={formData.photoUrls.leftSide} alt="Left Side" style={{maxWidth: 200}} />}</div>
        <div><Label>Photo - Right Side:</Label> {formData.photoUrls?.rightSide && <img src={formData.photoUrls.rightSide} alt="Right Side" style={{maxWidth: 200}} />}</div>
        <div><Label>Photo - Front:</Label> {formData.photoUrls?.front && <img src={formData.photoUrls.front} alt="Front" style={{maxWidth: 200}} />}</div>
        <div><Label>Photo - Back:</Label> {formData.photoUrls?.back && <img src={formData.photoUrls.back} alt="Back" style={{maxWidth: 200}} />}</div>
        <div><Label>Photo - Dashboard:</Label> {formData.photoUrls?.dashboard && <img src={formData.photoUrls.dashboard} alt="Dashboard" style={{maxWidth: 200}} />}</div>
        <div><Label>Photo - Keys:</Label> {formData.photoUrls?.keys && <img src={formData.photoUrls.keys} alt="Keys" style={{maxWidth: 200}} />}</div>
        <div><Label>Photo - Number Plates:</Label> {formData.photoUrls?.numberPlates && <img src={formData.photoUrls.numberPlates} alt="Number Plates" style={{maxWidth: 200}} />}</div>
        <div><Label>Customer Name:</Label> {formData.customerName}</div>
        <div><Label>Customer Signature:</Label><br />
          {formData.customerSignature && (
            <img src={formData.customerSignature} alt="Customer Signature" style={{maxWidth: 300, border: '1px solid #ccc'}} />
          )}
        </div>
        <div><Label>Driver Name:</Label> {formData.driverName}</div>
        <div><Label>Driver Signature:</Label><br />
          {formData.driverSignature && (
            <img src={formData.driverSignature} alt="Driver Signature" style={{maxWidth: 300, border: '1px solid #ccc'}} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
