import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; 
import User from "@/models/User";
import connectDB from "@/lib/db"; 

// GET: Fetch current user details
export async function GET(req) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();

		const user = await User.findOne({ email: session.user.email }).select(
			"-password"
		);

		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error("GET Profile Error:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// PUT: Update user profile
export async function PUT(req) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const { name, email, mobile } = await req.json();

		await connectDB();

		const updatedUser = await User.findOneAndUpdate(
			{ email: session.user.email },
			{ name, email, mobile },
			{ new: true }
		).select("-password");

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.error("PUT Profile Error:", error);
		return NextResponse.json(
			{ message: "Error updating profile" },
			{ status: 500 }
		);
	}
}
