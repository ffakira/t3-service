import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { playerId: string } }
) {
  const playerId = params.playerId;

  if (playerId.length === 0) {
    return NextResponse.json(
      {
        error: {
          message: "No player id",
        },
      },
      { status: 400 }
    );
  } else {
    try {
      const req = await fetch(
        `http://localhost:9000/api/games/stats/${playerId}`,
        {
          cache: "no-cache",
        }
      );
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
            status: req.status,
            ...resp,
          },
          { status: req.status }
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
}
