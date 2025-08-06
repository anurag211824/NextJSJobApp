import { NextRequest, NextResponse } from "next/server";
import db from "@/service/prisma";
import { getSession } from "@/service/session";

// Edit a job by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const jobId = params.id;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      location,
      employment_type,
      job_type,
      salary
    } = await request.json();

    // Validate required fields
    if (!title || !description || !location || !employment_type || !job_type || !salary) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if the job belongs to the user's company
    const userCompany = await db.company.findFirst({
      where: {
        owner_id: sessionUser.id
      }
    });

    if (!userCompany) {
      return NextResponse.json(
        { success: false, error: "You must create a company before editing jobs" },
        { status: 403 }
      );
    }

    // Validate employment_type and job_type values
    const validEmploymentTypes = ["full-time", "part-time", "contract", "internship"];
    const validJobTypes = ["Remote", "On-site", "Hybrid"];

    if (!validEmploymentTypes.includes(employment_type)) {
      return NextResponse.json(
        { success: false, error: "Invalid employment type. Must be: full-time, part-time, contract, or internship" },
        { status: 400 }
      );
    }

    if (!validJobTypes.includes(job_type)) {
      return NextResponse.json(
        { success: false, error: "Invalid job type. Must be: Remote, On-site, or Hybrid" },
        { status: 400 }
      );
    }

    // Validate salary is a positive number
    const salaryNum = parseInt(salary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      return NextResponse.json(
        { success: false, error: "Salary must be a positive number" },
        { status: 400 }
      );
    }

    // Update the job
    const updatedJob = await db.openings.updateMany({
      where: {
        id: jobId,
        company_id: userCompany.id
      },
      data: {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        employment_type,
        job_type,
        salary: salaryNum
      }
    });

    if (updatedJob.count === 0) {
      return NextResponse.json(
        { success: false, error: "Job not found or does not belong to your company" },
        { status: 404 }
      );
    }

    // Fetch the updated job with company details
    const job = await db.openings.findFirst({
      where: {
        id: jobId,
        company_id: userCompany.id
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Job updated successfully",
      job
    });

  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// Delete a job by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const jobId = params.id;

    // Check if the job ID is provided
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Check if the job belongs to the user's company
    const userCompany = await db.company.findFirst({
      where: {
        owner_id: sessionUser.id
      }
    });

    if (!userCompany) {
      return NextResponse.json(
        { success: false, error: "You must create a company before deleting jobs" },
        { status: 403 }
      );
    }

    // Delete the job
    const deletedJob = await db.openings.deleteMany({
      where: {
        id: jobId,
        company_id: userCompany.id
      }
    });

    if (deletedJob.count === 0) {
      return NextResponse.json(
        { success: false, error: "Job not found or does not belong to your company" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
