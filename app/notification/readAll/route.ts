import { readAllMessages } from "@/app/lib/NotificationFetch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return NextResponse.json({ status: 405 });
  }
  const { email } = (await req.json()) as any;
  const result = await readAllMessages(email);

  if (result) return NextResponse.json(true);

  return NextResponse.json(false);
}
