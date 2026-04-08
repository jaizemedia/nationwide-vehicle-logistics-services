"use client";
import { useParams } from 'next/navigation';
import { DeliveryFormPageReadOnlyComponent } from '@/components/DeliveryFormPageReadOnlyComponent';

export default function AdminDeliveryFormPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  return <DeliveryFormPageReadOnlyComponent jobId={jobId} />;
}
