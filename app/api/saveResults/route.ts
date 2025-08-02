import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await auth();
  try {
    if (!user?.user) {
      return NextResponse.json(
        { error: "Not authorized, signin first" },
        { status: 500 }
      );
    }
    const body = await req.json();
    const { wpm, accuracy, typeingType } = body;
    if (!wpm || !accuracy || !typeingType) {
      return NextResponse.json(
        { error: "All fields are required, please recheck" },
        { status: 500 }
      );
    }
  } catch (error) {}
}
