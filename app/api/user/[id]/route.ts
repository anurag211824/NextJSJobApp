import { NextRequest, NextResponse } from "next/server";
import db from "@/service/prisma";

interface ParamsAsProps {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: ParamsAsProps) {
  try {
    const {id }= await params;
    const user = await db.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
