/**
 * @dev a simple middleware to check the cookies
 * `connect.sid` to check if the user is authenticated
 * 
 * If the user is already authenticated and try to access `/login`
 * it will redirect to `/game` route
 */

import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const cookie = req.cookies.get("connect.sid");

    if (req.url === `http://localhost:3000/game`) {
        if (cookie) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    if (req.url === `http://localhost:3000/login`) {
        if (cookie) {
            return NextResponse.redirect(new URL("/game", req.url));
        } else {
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}
