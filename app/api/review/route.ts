/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { getSession } from "@/service/session";
import { NextRequest, NextResponse } from "next/server";
import db from "@/service/prisma";
// post a review
export async function POST(request: NextRequest) {
  try {
    const review = await request.json();
    const user = await getSession();
    const userId = user.id;
    const job = await db.openings.findUnique({
      where: { id: review.job_id },
      include: { company: true },
    });

    const existingReview = await db.review.findFirst({
      where: {
        user_id: userId,
        company_id: job.company_id,
      },
    });

    if (existingReview) {
      return NextResponse.json({
        success: false,
        error: "You have already reviewed this company",
      });
    }

    await db.review.create({
      data: {
        content: review.content,
        company_id: job.company_id,
        user_id: userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review posted",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: "Review could not be posted",
    });
  }
}

// get all review based on a JobId
export async function GET (request:NextRequest){

}

