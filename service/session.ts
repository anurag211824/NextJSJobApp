'use server'
import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export async function createToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role:user.role
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return token;
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.log("JWT verification error:", error);
    return null;
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("usertoken")?.value;
    if (!token) {
      return null;
    }
    const session = await decrypt(token);
    return session;
  } catch (error) {
    console.log("Session error:", error);
    return null;
  }
}

export async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get("usertoken")?.value;

  if (!token) {
    return null;
  }

  try {
    const session = await decrypt(token);
    return session;
  } catch (error) {
    console.log("Auth verification error:", error);
    return null;
  }
}