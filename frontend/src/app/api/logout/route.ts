import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE() {
  const getCookie = cookies().get("connect.sid");
  const req = await fetch("http://localhost:9000/api/auth/logout", {
    method: "DELETE",
    cache: "no-cache",
    credentials: "include",
  });

  if (req.status === 401) {
    return NextResponse.json(
      {
        status: 401,
        data: {
          message: "Succesfully logout",
        },
      },
      { status: 401 }
    );
  }

  /** @dev safety precrautions if express doesn't delete cookie */
  if (getCookie) {
    cookies().delete("connect.sid");
  }

  return NextResponse.json(
    {
      status: 302,
      data: {
        message: "Succesfully logout",
      },
    },
    { status: 302 }
  );
}
