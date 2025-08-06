import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/service/prisma";
import { createToken } from "@/service/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;
  
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      }, { status: 401 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      }, { status: 401 });
    }

    const userForToken = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    
    const token = await createToken(userForToken);

    // Create response with user data (excluding password)
    const response = NextResponse.json({
      success: true,
      message: "Signed in successfully",
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: 'usertoken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.log("Signin error:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong. Please try again.",
    }, { status: 500 });
  }
}