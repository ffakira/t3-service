import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const res = await request.json();

  if (!res.username || !res.password) {
    return NextResponse.json(
      {
        status: 400,
        error: {
          message: "Missing username or password field",
        },
      },
      { status: 400 }
    );
  }

  try {
    const req = await fetch("http://localhost:9000/api/auth/login", {
      method: "POST",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: res.username,
        password: res.password,
      }),
    });

    if (req.status === 200) {
      return NextResponse.json(
        {
          status: 200,
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": req.headers.get("set-cookie")!,
          },
        }
      );
    } else {
      return NextResponse.json(
        {
          status: 401,
          error: {
            message: "Unauthorized",
          },
        },
        {
          status: 401,
        }
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        status: 500,
        error: {
          message: "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}
