/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Building, Clock, Briefcase, Users } from "lucide-react";
import Link from "next/link";

const Jobgrid = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
          <p>
            Try adjusting your search criteria or check back later for new
            opportunities.
          </p>
        </div>
      </div>
    );
  }

  const formatSalary = (salary) => {
    if (salary >= 100000) {
      return `$${(salary / 1000).toFixed(0)}k`;
    }
    return `$${salary.toLocaleString()}`;
  };

  const getEmploymentTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "full-time":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "part-time":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "contract":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "internship":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getJobTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "remote":
        return "bg-emerald-100 text-emerald-800";
      case "on-site":
        return "bg-blue-100 text-blue-800";
      case "hybrid":
        return "bg-violet-100 text-violet-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <Link href={`/jobdetails/${job.id}`} key={job.id} className="block">
          <Card className="hover:shadow-lg transition-all h-[400px] duration-300  border-l-4 border-l-primary/20 hover:border-l-primary cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold line-clamp-2 text-foreground hover:text-primary transition-colors">
                    {job.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1 text-sm">
                    <Building className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {job.company?.name || "Company Name"}
                    </span>
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className={`shrink-0 ${getEmploymentTypeColor(
                    job.employment_type
                  )}`}
                >
                  {job.employment_type}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Job Description */}
              <div>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Location and Job Type */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>

                <Badge
                  variant="outline"
                  className={getJobTypeColor(job.job_type)}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {job.job_type}
                </Badge>
              </div>

              {/* Company Description */}
              {job.company?.description && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                  <div className="flex items-center gap-1 mb-1">
                    <Users className="w-3 h-3" />
                    <span className="font-medium">About Company</span>
                  </div>
                  <p className="line-clamp-2">{job.company.description}</p>
                </div>
              )}

              {/* Footer with Salary and Action */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-lg text-green-600">
                    {formatSalary(job.salary)}
                  </span>
                  <span className="text-xs text-muted-foreground">/year</span>
                </div>

                <Button
                  size="sm"
                  variant="default"
                  className="hover:bg-primary/90 transition-colors"
                  onClick={(e) => handleApplyClick(e, job.id)}
                >
                  Apply Now
                </Button>
              </div>
              <div>review</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default Jobgrid;
