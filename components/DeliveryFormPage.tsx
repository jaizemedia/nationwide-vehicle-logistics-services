"use client"

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

export function DeliveryFormPageComponent({ jobId, isAdmin = false }: { jobId: string, isAdmin?: boolean }) {
  // If admin, render read-only stepper
  if (isAdmin) {
    const DeliveryFormPageReadOnlyComponent = require('./DeliveryFormPageReadOnlyComponent').DeliveryFormPageReadOnlyComponent;
    return <DeliveryFormPageReadOnlyComponent jobId={jobId} />;
  }

  const { user } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job
        const jobRef = doc(db, 'jobs', jobId);
        const jobSnap = await getDoc(jobRef);
        if (!jobSnap.exists()) {
          router.push('/driver-portal/lookup');
          return;
        }
        const jobData = { id: jobSnap.id, ...jobSnap.data() } as Job;
        setJob(jobData);
        if (!jobData.driverId || jobData.driverId !== user?.uid) {
          router.push(`/driver-portal/job/${jobId}`);
          return;
        }
        // Check if form is read-only
        if (jobData.deliveryFormStatus === 'sent') {
          setIsReadOnly(true);
        }
        // Fetch or initialize form data
        const formRef = doc(db, 'forms', `${jobId}_delivery`);
        const formSnap = await getDoc(formRef);
        if (formSnap.exists()) {
          setFormData(formSnap.data() as FormData);
        } else {
          const newFormData: FormData = {
            ...DEFAULT_FORM_DATA,
            jobId,
            formType: 'delivery',
            driverId: user?.uid || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setFormData(newFormData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [jobId, user, router]);

  const updateFormField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    if (isReadOnly) return;
    setFormData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const updatePhotoUrl = (key: string, url: string) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        photoUrls: { ...prev.photoUrls, [key]: url },
      };
    });
  };

  const saveProgress = async () => {
    if (!formData || isReadOnly) return;
    try {
      const formRef = doc(db, 'forms', `${jobId}_delivery`);
      await setDoc(formRef, {
        ...formData,
        status: 'in-progress',
        updatedAt: new Date().toISOString(),
      });
      // Update job status
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        deliveryFormStatus: 'in-progress',
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData || isReadOnly) return;
    setIsSubmitting(true);
    try {
      const formRef = doc(db, 'forms', `${jobId}_delivery`);
      await setDoc(formRef, {
        ...formData,
        status: 'sent',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      // Update job status
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        deliveryFormStatus: 'sent',
        updatedAt: new Date().toISOString(),
      });
      router.push(`/driver-portal/job/${jobId}`);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToStep = (step: number) => {
    saveProgress();
    setCurrentStep(step);
  };

  if (loading || !formData || !job) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </AuthGuard>
    );
  }

  // --- Render editable delivery form steps (adapted from collection form) ---
  // For brevity, you can adapt the renderStep logic from the collection form, changing labels as needed.
  // ...existing renderStep and FormNavigation logic goes here...

  return (
    <AuthGuard>
      {/* ...existing editable delivery form UI goes here (steps, navigation, etc.)... */}
      <div className="min-h-screen flex flex-col pb-20">
        <PortalHeader job={job} formType="delivery" />
        <main className="flex-1 p-2 sm:p-4 overflow-x-auto">
          {/* TODO: Implement renderStep() for delivery form (see collection form for reference) */}
        </main>
        <FormNavigation
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onPrevious={() => setCurrentStep(Math.max(1, currentStep - 1))}
          onNext={() => setCurrentStep(Math.min(TOTAL_STEPS, currentStep + 1))}
          onCancel={() => router.push(`/driver-portal/job/${jobId}`)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          canGoNext={true}
          jobId={jobId}
        />
      </div>
    </AuthGuard>
  );
}
