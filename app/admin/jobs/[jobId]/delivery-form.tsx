"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { FormData } from '@/lib/types';

export default function AdminDeliveryForm() {
  const params = useParams();
  const jobId = params.jobId as string;
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchForm() {
      try {
        const formRef = doc(db, 'forms', `${jobId}_delivery`);
        const formSnap = await getDoc(formRef);
        if (formSnap.exists()) {
          setForm(formSnap.data() as FormData);
        } else {
          setForm(null);
        }
      } catch (e) {
        setForm(null);
      } finally {
        setLoading(false);
      }
    }
    fetchForm();
  }, [jobId]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!form) return <div className="text-center py-12">No delivery form found.</div>;

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Delivery Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div><b>Mileage:</b> {form.mileage}</div>
        <div><b>Fuel:</b> {form.fuel}</div>
        <div><b>Customer Name:</b> {form.customerName}</div>
        <div><b>Customer Signature:</b><br />
          {form.customerSignature && (
            <img src={form.customerSignature} alt="Customer Signature" style={{maxWidth: 300, border: '1px solid #ccc'}} />
          )}
        </div>
        <div><b>Driver Name:</b> {form.driverName}</div>
        <div><b>Driver Signature:</b><br />
          {form.driverSignature && (
            <img src={form.driverSignature} alt="Driver Signature" style={{maxWidth: 300, border: '1px solid #ccc'}} />
          )}
        </div>
        {/* Add more fields as needed */}
      </CardContent>
    </Card>
  );
}
