"use client";
import { useParams } from 'next/navigation';
import { CollectionFormPageComponent } from '@/components/CollectionFormPageComponent';

export default function AdminCollectionFormPage() {
	const params = useParams();
	const jobId = params.jobId as string;
	return <CollectionFormPageComponent jobId={jobId} readOnly />;
}
