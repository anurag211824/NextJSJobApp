/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { 
  Briefcase, 
  ArrowLeft, 
  Plus, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

export default function EmployerJobsDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    employment_type: '',
    job_type: '',
    salary: ''
  });

  useEffect(() => {
    fetchCompanyJobs();
  }, []);

  const fetchCompanyJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/company/job');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.data || []);
        
        // Get company info from the first job or fetch separately
        if (data.data && data.data.length > 0) {
          setCompany(data.data[0].company);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setAlert({
        type: "error",
        message: "Failed to fetch jobs"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch('/api/company/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          salary: parseInt(formData.salary)
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAlert({
          type: "success",
          message: "Job posted successfully!"
        });
        setTimeout(() => {
          setAlert(null);
        }, 2000);

        // Reset form and close modal
        setFormData({
          title: '',
          description: '',
          location: '',
          employment_type: '',
          job_type: '',
          salary: ''
        });
        setShowAddJobForm(false);

        // Refresh jobs list
        fetchCompanyJobs();
      } else {
        setAlert({
          type: "error",
          message: data.error || "Failed to create job"
        });
        setTimeout(() => {
          setAlert(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setAlert({
        type: "error",
        message: "An unexpected error occurred"
      });
      setTimeout(() => {
        setAlert(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };


 const handleDeleteJob = async (jobId) => {
  if (!confirm('Are you sure you want to delete this job?')) {
    return;
  }

  try {
    setLoading(true);
    const response = await fetch(`/api/company/job/${jobId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.success) {
      setAlert({
        type: "success",
        message: "Job deleted successfully!"
      });
      // Remove alert after 3 seconds
      setTimeout(() => {
        setAlert(null);
      }, 3000);
      // Refresh jobs list
      fetchCompanyJobs();
    } else {
      setAlert({
        type: "error",
        message: data.error || "Failed to delete job"
      });
      // Remove error alert after 5 seconds
      setTimeout(() => {
        setAlert(null);
      }, 5000);
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    setAlert({
      type: "error",
      message: "An unexpected error occurred"
    });
    // Remove error alert after 5 seconds
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  } finally {
    setLoading(false);
  }
}

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold">Job Management</h1>
              </div>
              {company && (
                <p className="text-gray-400">Managing jobs for {company.name}</p>
              )}
            </div>
            
            <Button
              onClick={() => setShowAddJobForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Job
            </Button>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <Alert className={`mb-6 ${
            alert.type === "success" 
              ? "border-green-200 bg-green-50 text-green-800" 
              : "border-red-200 bg-red-50 text-red-800"
          }`}>
            {alert.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <div className="ml-2">{alert.message}</div>
          </Alert>
        )}

        {/* Add Job Form Modal */}
        {showAddJobForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Add New Job</CardTitle>
                  <CardDescription className="text-gray-400">
                    Create a new job posting for your company
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddJobForm(false)}
                  className="text-white hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Job Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Senior Frontend Developer"
                      className="bg-black border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">Job Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the role, responsibilities, and what you're looking for"
                      rows={3}
                      className="bg-black border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location" className="text-white">Location *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, State/Country"
                        className="bg-black border-gray-600 text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="salary" className="text-white">Salary (Annual) *</Label>
                      <Input
                        id="salary"
                        name="salary"
                        type="number"
                        value={formData.salary}
                        onChange={handleChange}
                        placeholder="e.g., 75000"
                        className="bg-black border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employment_type" className="text-white">Employment Type *</Label>
                      <select
                        id="employment_type"
                        name="employment_type"
                        value={formData.employment_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-black border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select employment type</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="job_type" className="text-white">Work Type *</Label>
                      <select
                        id="job_type"
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-black border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select work type</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? 'Posting...' : 'Post Job'}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddJobForm(false)}
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No jobs posted yet</h3>
              <p className="text-gray-400 mb-6">Create your first job posting to start finding candidates</p>
              <Button
                onClick={() => setShowAddJobForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Your First Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{job.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        <div className="flex items-center gap-1 mt-1">
                          <Building className="w-4 h-4" />
                          {job.company?.name}
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-blue-600 text-white">
                        {job.employment_type}
                      </Badge>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {job.job_type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formatSalary(job.salary)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.employment_type}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800">
                      Edit Job
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800">
                      View Applications
                    </Button>
                    <Button 
                      onClick={() => handleDeleteJob(job.id)} 
                      variant="outline" 
                      size="sm" 
                      className="border-red-600 text-red-400 hover:bg-red-900"
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}