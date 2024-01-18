import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  if (userId.length === 0) {
    return NextResponse.json(
      {
        status: 400,
        error: {
          message: "No user id",
        },
      },
      { status: 400 }
    );
  } else {
    try {
      const req = await fetch(`http://localhost:9000/api/auth/user/${userId}`);
      const resp = await req.json();

      if (req.status === 200) {
        return NextResponse.json(
          {
            status: 200,
            data: {
              username: resp.data.username,
            },
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json({ ...resp }, { status: req.status });
      }
    } catch (err) {
      return NextResponse.json({
        status: 500,
        error: {
          message: "Internal server error",
        },
      });
    }
  }
}
