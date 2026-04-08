"use client";
import { useParams } from 'next/navigation';
import { CollectionFormView } from '@/components/CollectionFormView';

export default function AdminCollectionFormPage() {
	const params = useParams();
	const jobId = params.jobId as string;
	return <CollectionFormView jobId={jobId} readOnly />;
}
