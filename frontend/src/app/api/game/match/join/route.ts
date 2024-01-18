import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookies = request.headers.get("cookie");

  try {
    const req = await fetch("http://localhost:9000/api/games/join", {
      method: "POST",
      headers: {
        Cookie: cookies!,
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      credentials: "include",
    });
    const resp = await req.json();

    if (req.status === 200) {
      return NextResponse.json(
        {
          status: 200,
          data: resp.data,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ ...resp }, { status: req.status });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json(
        {
          status: 500,
          error: { message: "Internal server error" },
        },
        { status: 500 }
      );
    }
  }
}
