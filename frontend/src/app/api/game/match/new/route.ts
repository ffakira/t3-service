import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { gameType } = await request.json();
  const cookies = request.headers.get("cookie");

  if (gameType === "bot" || gameType === "pvp") {
    try {
      const req = await fetch("http://localhost:9000/api/games/create", {
        method: "POST",
        headers: {
          Cookie: cookies!,
          "Content-Type": "application/json",
        },
        cache: "no-cache",
        credentials: "include",
        body: JSON.stringify({
          gameType
        }),
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
        return NextResponse.json(
          {
            ...resp,
          },
          { status: req.status }
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
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
  } else {
    return NextResponse.json(
      {
        status: 400,
        error: {
          message: "Invalid game type",
        },
      },
      { status: 400 }
    );
  }
}
