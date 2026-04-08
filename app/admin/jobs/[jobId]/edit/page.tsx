"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import type { Job } from "@/lib/types";

export default function EditJobPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Job>>({});
  const [job, setJob] = useState<Job | null>(null);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || authLoading) return;
    if (!user || !isAdmin) {
      router.push("/admin");
      return;
    }
    fetchJob();
    // eslint-disable-next-line
  }, [mounted, authLoading, user, isAdmin, jobId, router]);

  const fetchJob = async () => {
    if (!jobId) return;
    try {
      const jobDoc = await getDoc(doc(db, "jobs", jobId));
      if (jobDoc.exists()) {
        const jobData = { id: jobDoc.id, ...jobDoc.data() } as Job;
        setJob(jobData);
        setFormData(jobData);
      } else {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "jobs", jobId), {
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      router.push(`/admin/jobs/${jobId}`);
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link href={`/admin/jobs/${jobId}`}>
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Job
              </Button>
            </Link>
            <h1 className="text-xl font-bold ml-4">Edit Job</h1>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Job Reference</Label>
                  <Input
                    value={formData.jobReference || ""}
                    onChange={(e) => handleInputChange("jobReference", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Vehicle Registration</Label>
                  <Input
                    value={formData.vehicleRegistration || ""}
                    onChange={(e) => handleInputChange("vehicleRegistration", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Vehicle Make</Label>
                  <Input
                    value={formData.vehicleMake || ""}
                    onChange={(e) => handleInputChange("vehicleMake", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Vehicle Model</Label>
                  <Input
                    value={formData.vehicleModel || ""}
                    onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Vehicle Color</Label>
                  <Input
                    value={formData.vehicleColor || ""}
                    onChange={(e) => handleInputChange("vehicleColor", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Chassis Number</Label>
                  <Input
                    value={formData.chassisNumber || ""}
                    onChange={(e) => handleInputChange("chassisNumber", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Required Delivery Date</Label>
                  <Input
                    type="date"
                    value={formData.requiredDeliveryDate || ""}
                    onChange={(e) => handleInputChange("requiredDeliveryDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Collection Address</Label>
                  <Input
                    value={formData.collectionAddress || ""}
                    onChange={(e) => handleInputChange("collectionAddress", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Collection Postcode</Label>
                  <Input
                    value={formData.collectionPostcode || ""}
                    onChange={(e) => handleInputChange("collectionPostcode", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Collection Telephone</Label>
                  <Input
                    value={formData.collectionTelephone || ""}
                    onChange={(e) => handleInputChange("collectionTelephone", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Collection Telephone 2</Label>
                  <Input
                    value={formData.collectionTelephone2 || ""}
                    onChange={(e) => handleInputChange("collectionTelephone2", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Collection Name</Label>
                  <Input
                    value={formData.collectionName || ""}
                    onChange={(e) => handleInputChange("collectionName", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Delivery Address</Label>
                  <Input
                    value={formData.deliveryAddress || ""}
                    onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Delivery Postcode</Label>
                  <Input
                    value={formData.deliveryPostcode || ""}
                    onChange={(e) => handleInputChange("deliveryPostcode", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Delivery Telephone</Label>
                  <Input
                    value={formData.deliveryTelephone || ""}
                    onChange={(e) => handleInputChange("deliveryTelephone", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Delivery Telephone 2</Label>
                  <Input
                    value={formData.deliveryTelephone2 || ""}
                    onChange={(e) => handleInputChange("deliveryTelephone2", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Delivery Name</Label>
                  <Input
                    value={formData.deliveryName || ""}
                    onChange={(e) => handleInputChange("deliveryName", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Special Notes</Label>
                  <Input
                    value={formData.specialNotes || ""}
                    onChange={(e) => handleInputChange("specialNotes", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Job Provider Notes</Label>
                  <Input
                    value={formData.jobProviderNotes || ""}
                    onChange={(e) => handleInputChange("jobProviderNotes", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" className="bg-black text-white px-8 py-3 rounded-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
