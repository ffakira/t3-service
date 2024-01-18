import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookies = request.headers.get("cookie");

  const req = await fetch("http://localhost:9000/api/auth/isAuth", {
    method: "GET",
    headers: {
      Cookie: cookies!
    },
    cache: "no-cache",
    credentials: "include",
  });
  const resp = await req.json();

  return NextResponse.json(
    {
      data: resp.data,
    },
    { status: req.status }
  );
}
