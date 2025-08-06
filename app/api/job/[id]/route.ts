import { NextRequest, NextResponse } from "next/server";
import db from "@/service/prisma";

// Get detailed information about a specific job by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = await params.id;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Fetch job with company details and reviews
    const job = await db.openings.findUnique({
      where: {
        id: jobId
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true,
            reviews: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true
                  }
                }
              },
              orderBy: {
                id: 'desc'
              }
            }
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job
    });

  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch job details" },
      { status: 500 }
    );
  }
}
