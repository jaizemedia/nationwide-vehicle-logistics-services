
'use client'

import { use } from 'react'
import { DeliveryFormPageComponent } from '@/components/DeliveryFormPage';

export default function DeliveryFormPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  return <DeliveryFormPageComponent jobId={jobId} />;
}
