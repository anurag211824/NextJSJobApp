/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { NextResponse } from "next/server";
import db from "@/service/prisma";
import { getSession } from "@/service/session";

export async function POST(request: Request) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, description } = await request.json();

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: "Name and description are required" },
        { status: 400 }
      );
    }

    // Check if user already has a company
    const existingCompany = await db.company.findFirst({
      where: {
        owner_id: sessionUser.id
      }
    });

    if (existingCompany) {
      return NextResponse.json(
        { success: false, error: "User already has a company" },
        { status: 400 }
      );
    }

    // Create the company
    const company = await db.company.create({
      data: {
        name,
        description,
        owner_id: sessionUser.id
      }
    });

    return NextResponse.json({
      success: true,
      message: "Company created successfully",
      company
    });

  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create company" },
      { status: 500 }
    );
  }
}