/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";

import React, { useContext, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Filter, DollarSign, Briefcase, MapPin, RotateCcw } from 'lucide-react';
import { AppContext } from '@/context/AppContext';

const JobFilterSidebar = () => {
const {user} =  useContext(AppContext)
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('q') || '';

  // Local state for filters
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState(
    searchParams.get('employment_type')?.split(',') || []
  );
  const [selectedJobTypes, setSelectedJobTypes] = useState(
    searchParams.get('job_type')?.split(',') || []
  );
  const [salary, setSalary] = useState(
    parseInt(searchParams.get('salary')) || 50000
  );

  // Predefined values
  const employmentTypes = ['full-time', 'part-time', 'contract', 'internship'];
  const jobTypes = ['Remote', 'On-site', 'Hybrid'];
  const minSalary = 0;
  const maxSalary = 200000;

  const formatSalary = (salary) => {
    if (salary >= 1000) {
      return `$${(salary / 1000).toFixed(0)}k`;
    }
    return `$${salary.toLocaleString()}`;
  };

  const handleEmploymentTypeChange = (type, checked) => {
    if (checked) {
      setSelectedEmploymentTypes([...selectedEmploymentTypes, type]);
    } else {
      setSelectedEmploymentTypes(selectedEmploymentTypes.filter(t => t !== type));
    }
  };

  const handleJobTypeChange = (type, checked) => {
    if (checked) {
      setSelectedJobTypes([...selectedJobTypes, type]);
    } else {
      setSelectedJobTypes(selectedJobTypes.filter(t => t !== type));
    }
  };

  const handleSalaryChange = (value) => {
    setSalary(parseInt(value));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    if (selectedEmploymentTypes.length > 0) {
      params.set('employment_type', selectedEmploymentTypes.join(','));
    }
    
    if (selectedJobTypes.length > 0) {
      params.set('job_type', selectedJobTypes.join(','));
    }
    
    if (salary > minSalary) {
      params.set('salary', salary.toString());
    }

    router.push(`/?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedEmploymentTypes([]);
    setSelectedJobTypes([]);
    setSalary(50000);
    
    if (searchQuery) {
      router.push(`/?q=${searchQuery}`);
    } else {
      router.push('/');
    }
  };

  const hasActiveFilters = 
    selectedEmploymentTypes.length > 0 || 
    selectedJobTypes.length > 0 || 
    salary > minSalary;

  return (
    <div className="p-4 h-full text-white">
      <div className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Filter className="w-5 h-5" />
            Filters
          </div>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-gray-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Employment Type */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span className="font-medium">Employment Type</span>
            {selectedEmploymentTypes.length > 0 && (
              <Badge variant="secondary">{selectedEmploymentTypes.length}</Badge>
            )}
          </div>
          {employmentTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={`employment-${type}`}
                checked={selectedEmploymentTypes.includes(type)}
                onCheckedChange={(checked) => handleEmploymentTypeChange(type, checked)}
              />
              <Label htmlFor={`employment-${type}`} className="text-sm cursor-pointer capitalize">
                {type}
              </Label>
            </div>
          ))}
        </div>

        {/* Salary Range */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">Minimum Salary</span>
          </div>
          <div className="px-2 py-4">
            <input
              type="range"
              value={salary}
              onChange={(e) => handleSalaryChange(e.target.value)}
              max={maxSalary}
              min={minSalary}
              step={5000}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(salary / maxSalary) * 100}%, #4b5563 ${(salary / maxSalary) * 100}%, #4b5563 100%)`
              }}
            />
          </div>
          <div className="text-center text-sm text-gray-300">
            <span>{formatSalary(salary)}+</span>
          </div>
        </div>

        {/* Job Type */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">Work Type</span>
            {selectedJobTypes.length > 0 && (
              <Badge variant="secondary">{selectedJobTypes.length}</Badge>
            )}
          </div>
          {jobTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={`jobtype-${type}`}
                checked={selectedJobTypes.includes(type)}
                onCheckedChange={(checked) => handleJobTypeChange(type, checked)}
              />
              <Label htmlFor={`jobtype-${type}`} className="text-sm cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>

        {/* Apply Filters Button */}
        <Button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white" 
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default JobFilterSidebar;