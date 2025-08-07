/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import db from "@/service/prisma";
export async function POST(request: NextRequest) {
  try {
    const { user_id, job_id } = await request.json();
    
    if (!user_id || !job_id) {
      return NextResponse.json(
        { error: "User ID and Job ID are required" },
        { status: 400 }
      );
    }
    const existingApplication = await db.application.findFirst({
      where: {
        user_id: user_id,
        job_id: job_id
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this job" },
        { status: 409 }
      );
    }

     await db.application.create({
      data: {
        user_id,
        job_id
      },
    });

    return NextResponse.json(
        {success:true,
         message:"Application Posted"
        }
    );

  } catch (error) {
    console.log(error);
    return NextResponse.json(

      { 
        success:false,
        error: "Failed to submit application",

       }
    );
  }
}
