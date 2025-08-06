import { NextRequest, NextResponse } from "next/server";
import db from "@/service/prisma";
import { getSession } from "@/service/session";

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
