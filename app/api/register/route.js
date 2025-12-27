// app/api/register/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
	try {
		const { name, email, password, role, phone, address } = await req.json();

		// 1. Validate input
		if (!name || !email || !password) {
			return NextResponse.json(
				{ message: "Name, email, and password are required." },
				{ status: 400 }
			);
		}

		// 2. Connect to DB
		await connectDB();

		// 3. Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ message: "User with this email already exists." },
				{ status: 409 }
			);
		}

		// 4. Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// 5. Create the user
		// NOTE: In a real app, you might hardcode role to 'user' here for security.
		// We allow 'role' from the form so you can create Officers/Staff for testing.
		await User.create({
			name,
			email,
			password: hashedPassword,
			role: role || "user",
			phone,
			address,
		});

		return NextResponse.json(
			{ message: "User registered successfully" },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Registration Error:", error);
		return NextResponse.json(
			{ message: "An error occurred while registering." },
			{ status: 500 }
		);
	}
}
