
'use client'

import { DeliveryFormPageComponent } from '@/components/DeliveryFormPage';


export default function DeliveryFormPage({ params }: { params: { jobId: string } }) {
  return <DeliveryFormPageComponent jobId={params.jobId} />;
}
