"use client";
import { useParams } from 'next/navigation';
import { DeliveryFormView } from '@/components/DeliveryFormView';

export default function AdminDeliveryFormPage() {
	const params = useParams();
	const jobId = params.jobId as string;
	return <DeliveryFormView jobId={jobId} readOnly />;
}
