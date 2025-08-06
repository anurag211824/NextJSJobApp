/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { NextResponse } from "next/server";
import db from "@/service/prisma";

export async function GET(request, { params }) {
  try {
    // Await params before using its properties (Next.js 15 requirement)
    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        hasCompany: false,
        error: "User ID is required" 
      });
    }

    // Check if user has a company using the correct field name
    const company = await db.company.findFirst({
      where: {
        owner_id: userId  // Use owner_id instead of userId
      }
    });

    return NextResponse.json({
      success: true,
      hasCompany: Boolean(company),
      company: company || null
    });

  } catch (error) {
    console.error("Error checking user company:", error);
    return NextResponse.json(
      { 
        success: false, 
        hasCompany: false,
        error: "Failed to check company" 
      },
      { status: 500 }
    );
  }
}