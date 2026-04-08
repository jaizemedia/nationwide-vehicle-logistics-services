"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function ClientPortal() {
  const [numberPlate, setNumberPlate] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitted(true);
    setJobs([]);
    try {
      const res = await fetch("/api/client-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numberPlate: numberPlate.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setJobs(data.jobs);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
              <Navbar />
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Check Your Job Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              placeholder="Enter your vehicle number plate"
              value={numberPlate}
              onChange={e => setNumberPlate(e.target.value)}
              required
              autoFocus
            />
            <Button type="submit" disabled={loading || !numberPlate.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check Progress"}
            </Button>
          </form>
          {submitted && !loading && (
            <div className="mt-6">
              {error && <div className="text-red-600 mb-4">{error}</div>}
              {jobs.length === 0 && !error && (
                <div className="text-gray-500">No jobs found for this number plate.</div>
              )}
              {jobs.map((job) => (
                <Card key={job.id} className="mb-4 border border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Job Reference: {job.jobReference}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <span className="font-semibold">Vehicle:</span> {job.vehicleMake} {job.vehicleModel}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Status:</span>{" "}
                      <Badge>{getClientJobStatus(job)}</Badge>
                    </div>
                    {job.specialNotes && (
                      <div className="mb-2">
                        <span className="font-semibold">Notes:</span> {job.specialNotes}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">Last updated: {job.updatedAt ? new Date(job.updatedAt).toLocaleString() : "-"}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Add this helper function at the bottom of the file (outside the component):
function getClientJobStatus(job: any) {
  if (job.collectionFormStatus === "declined") return "Job Declined";
  if (job.collectionFormStatus === "new") return "Job Request Sent";
  if (job.collectionFormStatus === "in-progress") return "Job Accepted";
  if (job.collectionFormStatus === "sent" && job.deliveryFormStatus !== "sent") return "Collected";
  if (job.deliveryFormStatus === "sent") return "Delivered";
  return "Job Accepted";
}
