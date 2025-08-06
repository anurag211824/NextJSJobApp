import { NextRequest, NextResponse } from "next/server";
import db from "@/service/prisma";
import { getSession } from "@/service/session";

// Create a Job
export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
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

    // Validate required fields according to schema
    if (!title || !description || !location || !employment_type || !job_type || !salary) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Get the user's company first
    const userCompany = await db.company.findFirst({
      where: {
        owner_id: sessionUser.id
      }
    });

    if (!userCompany) {
      return NextResponse.json(
        { success: false, error: "You must create a company before posting jobs" },
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

    // Create the job opening (using exact schema field names)
    const job = await db.openings.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        employment_type,
        job_type,
        salary: salaryNum,
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
      message: "Job created successfully",
      job
    });

  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create job" },
      { status: 500 }
    );
  }
}
// get all Jobs
export async function GET() {
  try {
    const sessionUser = await getSession();
    if (!sessionUser?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get jobs for the user's company
    const userCompany = await db.company.findFirst({
      where: {
        owner_id: sessionUser.id
      }
    });

    if (!userCompany) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const jobs = await db.openings.findMany({
      where: {
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
      },
      orderBy: {
        id: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: jobs
    });

  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}