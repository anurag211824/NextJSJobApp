/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import JobFilterSidebar from "@/components/JobFilterSidebar";
import Jobgrid from "@/components/Jobgrid";
import UnauthorizedAlert from "@/components/UnauthorizedAlert";

export default async function Home({ searchParams }) {
  const searchParamsObj = await searchParams;
  const { q, employment_type, job_type, salary, error, userRole } = searchParamsObj;
  console.log('Filters:', { q, employment_type, job_type, salary });
  console.log('Error params:', { error, userRole });

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
    <div className="flex flex-row min-h-screen bg-black">
      <div className="w-60 border-r overflow-y-auto fixed h-screen z-10">
        <JobFilterSidebar/>
      </div>
      <div className="flex-1 bg-black p-6 overflow-y-auto ml-60">
        {/* Show unauthorized alert if user tried to access employer routes */}
        {error === 'user_not_employer' && (
          <UnauthorizedAlert userRole={userRole} />
        )}
        <Jobgrid jobs={jobs}/>
      </div>
    </div>
  );
}