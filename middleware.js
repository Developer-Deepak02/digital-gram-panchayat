import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req) {
	// 1. Get the token (securely decodes the JWT)
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	const { pathname } = req.nextUrl;

	// 2. Define Protected Paths
	const isAuthPage =
		pathname.startsWith("/login") || pathname.startsWith("/register");
	const isOfficerPage = pathname.startsWith("/officer");
	const isStaffPage = pathname.startsWith("/staff");
	const isUserPage = pathname.startsWith("/user");

	// -----------------------------------------------------------
	// SCENARIO A: User is NOT logged in
	// -----------------------------------------------------------
	if (!token) {
		// If trying to access a protected page, kick them to Login
		if (isOfficerPage || isStaffPage || isUserPage) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
		// Allow them to visit public pages (/, /login, /register, /api, etc.)
		return NextResponse.next();
	}

	// -----------------------------------------------------------
	// SCENARIO B: User IS logged in
	// -----------------------------------------------------------

	// 1. Prevent logged-in users from visiting Login/Register
	if (isAuthPage) {
		if (token.role === "officer")
			return NextResponse.redirect(new URL("/officer/services", req.url));
		if (token.role === "staff")
			return NextResponse.redirect(new URL("/staff/applications", req.url));
		return NextResponse.redirect(new URL("/user/services", req.url));
	}

	// 2. Role-Based Security (The "Bouncer")

	// If a USER/STAFF tries to access Officer pages
	if (isOfficerPage && token.role !== "officer") {
		return NextResponse.redirect(new URL("/", req.url));
	}

	// If a USER tries to access Staff pages
	if (isStaffPage && token.role !== "staff" && token.role !== "officer") {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}

// Configuration: Matcher tells Next.js which routes to run this middleware on
export const config = {
	matcher: [
		"/officer/:path*",
		"/staff/:path*",
		"/user/:path*",
		"/login",
		"/register/:path*",
	],
};
