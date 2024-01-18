import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;
  const cookies = request.headers.get("cookie");

  if (gameId.length === 0) {
    return NextResponse.json(
      {
        status: 400,
        error: {
          message: "No game id",
        },
      },
      { status: 400 }
    );
  } else {
    try {
      const req = await fetch(
        `http://localhost:9000/api/games/match/${gameId}`,
        {
          method: "GET",
          headers: {
            Cookie: cookies!,
            "Content-Type": "application/json",
          },
          cache: "no-cache",
          credentials: "include",
        }
      );
      const resp = await req.json();

      if (req.status === 200) {
      } else {
        return NextResponse.json(
          {
            ...resp,
          },
          { status: req.status }
        );
      }
    } catch (err) {
      return NextResponse.json(
        { status: 500, error: { message: "Internal server error" } },
        { status: 500 }
      );
    }
  }
}
