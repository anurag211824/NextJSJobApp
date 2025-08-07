/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";

import React, { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Building,
  DollarSign,
  Clock,
  Briefcase,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { AppContext } from "@/context/AppContext";

const JobDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewPosted, setreviewPosted] = useState("");
  const [reviewContent, setreviewContent] = useState("");
  const { user } = useContext(AppContext);
  const jobId = params.jobId;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/job/${jobId}`);
        const result = await response.json();

        if (result.success) {
          setJobData(result.data);
        } else {
          setError(result.error || "Failed to fetch job details");
        }
      } catch (err) {
        setError("An error occurred while fetching job details");
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const formatSalary = (salary) => {
    if (salary >= 100000) {
      return `$${(salary / 1000).toFixed(0)}k`;
    }
    return `$${salary.toLocaleString()}`;
  };

  const getEmploymentTypeColor = () => {
    return "";
  };

  const getJobTypeColor = () => {
    return "";
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error ||
              "The job you are looking for does not exist or has been removed."}
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  const handlereviewFormChange = (e) => {
    const { value } = e.target;
    setreviewContent(value);
  };
  const submitReview = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: reviewContent,
          job_id: jobId,
        }),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData); // Debug log

      if (responseData.success) {
        setreviewContent("");
        setreviewPosted(
          responseData.message || "Review submitted successfully!"
        );
      } else {
        setreviewContent("");
        setreviewPosted(responseData.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setreviewPosted("An error occurred while submitting the review");
    }
  };
  const handleApplyNow = async () => {
    try {
      const response = await fetch("/api/application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          job_id: jobId,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        console.log(responseData.message);
        alert("Application submitted successfully!");
      } else {
        console.log("Error:", responseData.error);
        alert("Error: " + responseData.error);
      }
    } catch (error) {
      console.error("Application error:", error);
      alert("Failed to submit application");
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold mb-2">
                    {jobData.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <Building className="w-5 h-5" />
                    {jobData.company.name}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getEmploymentTypeColor()}>
                    {jobData.employment_type}
                  </Badge>
                  <Badge variant="outline" className={getJobTypeColor()}>
                    <Clock className="w-3 h-3 mr-1" />
                    {jobData.job_type}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{jobData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-green-600">
                    {formatSalary(jobData.salary)}/year
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 sm:flex-none"
                >
                  Apply Now
                </Button>
                <Button variant="outline" size="lg">
                  Save Job
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {jobData.description}
                </p>
              </div>
            </CardContent>
          </Card>
          <Tabs defaultValue="GiveReview" className="w-[400px]">
            <TabsList>
              <TabsTrigger
                value="GiveReview"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Give Review
              </TabsTrigger>

              <TabsTrigger
                value="UsersReview"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Users Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="GiveReview">
              <form
                onSubmit={submitReview}
                className="space-y-4 w-full max-w-sm"
              >
                <Input
                  placeholder="Write your review..."
                  type="text"
                  name="content"
                  required
                  value={reviewContent}
                  onChange={handlereviewFormChange}
                />
                <Button
                  variant="outline"
                  type="submit"
                  className="w-1/2 bg-red-500"
                >
                  Submit Review
                </Button>
                {reviewPosted && (
                  <p className="text-green-300">{reviewPosted}</p>
                )}
              </form>
            </TabsContent>

            <TabsContent value="UsersReview">bye</TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                About {jobData.company.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {jobData.company.description}
              </p>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View Company Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Employment Type:
                  </span>
                  <Badge variant="outline" className={getEmploymentTypeColor()}>
                    {jobData.employment_type}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Work Type:</span>
                  <Badge variant="outline" className={getJobTypeColor()}>
                    {jobData.job_type}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{jobData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salary:</span>
                  <span className="font-medium text-green-600">
                    {formatSalary(jobData.salary)}/year
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleApplyNow}
                variant="outline"
                className="w-full bg-green-400"
              >
                Apply Now
              </Button>
              <Button riant="outline" className="w-full bg-blue-400">
                Save for Later
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
