import { useParams } from 'next/navigation';
import { DeliveryFormPageComponent } from '@/components/DeliveryFormPage';

export default function AdminDeliveryFormPage() {
	const params = useParams();
	const jobId = params.jobId as string;
	return <DeliveryFormPageComponent jobId={jobId} isAdmin />;
}
