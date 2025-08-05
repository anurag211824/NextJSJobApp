import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/service/prisma";
import { createToken } from "@/service/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, role } = body;
  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "User with this email already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    const userForToken = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = await createToken(userForToken);

    const response = NextResponse.json({
      success: true,
      message: "User created",
      data: user,
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
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "User not created",
    });
  }
}