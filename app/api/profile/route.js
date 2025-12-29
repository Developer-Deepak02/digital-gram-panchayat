import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET: Fetch current user details
export async function GET(req) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	await connectDB();

	// Fetch user but exclude the password field for security
	const user = await User.findById(session.user.id).select("-password");

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	return NextResponse.json(user);
}

// PUT: Update user details (Address/Phone)
export async function PUT(req) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { phone, address } = await req.json();
		await connectDB();

		// Update only specific fields
		const updatedUser = await User.findByIdAndUpdate(
			session.user.id,
			{ phone, address },
			{ new: true } // Return the updated document
		).select("-password");

		return NextResponse.json(updatedUser);
	} catch (error) {
		return NextResponse.json({ error: "Update failed" }, { status: 500 });
	}
}
