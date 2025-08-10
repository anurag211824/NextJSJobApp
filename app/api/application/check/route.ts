import { NextResponse } from "next/server";
import db from "@/service/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const jobId = body.jobId;
  const userId = body.userId;

  try {
    const application = await db.application.findMany({
      where: {
        job_id: jobId,
        user_id: userId,
      },
    });
    if (application && application.length > 0) {
      return NextResponse.json({
        success: true,
      });
    } else {
      return NextResponse.json({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
    });
  }
}
