
'use client'

import { DeliveryFormPageComponent } from '@/components/DeliveryFormPage';


export default async function DeliveryFormPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  return <DeliveryFormPageComponent jobId={jobId} />;
}
