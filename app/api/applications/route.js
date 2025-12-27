// app/api/applications/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Application from "@/models/Application";
import { getServerSession } from "next-auth";

export async function POST(req) {
	const session = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		await connectDB();
		const body = await req.json();

		// Check if user already applied for this specific service
		const existing = await Application.findOne({
			applicantId: session.user.id,
			serviceId: body.serviceId,
		});

		if (existing) {
			return NextResponse.json(
				{ message: "You have already applied for this service." },
				{ status: 400 }
			);
		}

		const newApp = await Application.create({
			applicantId: session.user.id,
			serviceId: body.serviceId,
			formData: body.formData, // e.g., { additionalInfo: "..." }
			status: "pending",
		});

		return NextResponse.json(
			{ message: "Application submitted successfully" },
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Submission failed" }, { status: 500 });
	}
}
