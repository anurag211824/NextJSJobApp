import { NextResponse } from "next/server";
import db from "@/service/prisma";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const searchQuery = searchParams.get("q") || "";
    const employmentTypes = searchParams.get("employment_type")?.split(",") || [];
    const jobTypes = searchParams.get("job_type")?.split(",") || [];
    const minSalary = parseInt(searchParams.get("salary")) || 0;

    // Build Prisma where clause
    const whereClause = {};

    // Filter by search query
    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        { company: { name: { contains: searchQuery, mode: "insensitive" } } },
      ];
    }

    // Filter by employment type
    if (employmentTypes.length > 0) {
      whereClause.employment_type = { in: employmentTypes };
    }

    // Filter by job type
    if (jobTypes.length > 0) {
      whereClause.job_type = { in: jobTypes };
    }

    // Filter by minimum salary
    if (minSalary > 0) {
      whereClause.salary = { gte: minSalary };
    }

    // Fetch jobs from database
    const filteredJobs = await db.openings.findMany({
      where: whereClause,
      include: {
        company: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: filteredJobs,
      total: filteredJobs.length,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
