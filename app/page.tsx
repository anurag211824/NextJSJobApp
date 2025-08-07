/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import JobFilterSidebar from "@/components/JobFilterSidebar";
import Jobgrid from "@/components/Jobgrid";
import MobileFilterSiderBar from "@/components/MobileFilterSiderBar";


export default async function Home({ searchParams }) {
  const searchParamsObj = await searchParams;
  const { q, employment_type, job_type, salary, error, userRole } = searchParamsObj;

  const getJobs = async () => {
    try {
      const params = new URLSearchParams();
      
      if (q) params.set('q', q);
      if (employment_type) params.set('employment_type', employment_type);
      if (job_type) params.set('job_type', job_type);
      if (salary) params.set('salary', salary);

      const response = await fetch(
        `http://localhost:3000/api/search${params.toString() ? `?${params.toString()}` : ""}`
      );
      const responseData = await response.json();
      
      if (responseData.success) {
        return responseData.data || [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const jobs = await getJobs();
  return (
     <div className="flex flex-row min-h-screen bg-black relative">
      {/* Hidden on small screens, visible on md+ screens */}
      <div className="hidden md:hidden lg:block w-60 border-r overflow-y-auto fixed h-screen z-10">
        <JobFilterSidebar/>
      </div>
    
      
      
    
      <div className="flex-1 bg-black p-6 lg:ml-60">
        <Jobgrid jobs={jobs}/>
      </div>
    </div>
  );
}