import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Application from "@/models/Application";
import Service from "@/models/Service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session)
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const body = await req.json();

		// Validate Input
		if (!body.serviceId) {
			return NextResponse.json(
				{ message: "Service ID is required" },
				{ status: 400 }
			);
		}

		await connectDB();

		// --- NEW CHECK: Prevent Duplicates ---
		const existingApplication = await Application.findOne({
			applicantId: session.user.id,
			serviceId: body.serviceId,
		});

		if (existingApplication) {
			return NextResponse.json(
				{ message: "You have already applied for this scheme." },
				{ status: 409 } // 409 Conflict
			);
		}
		// -------------------------------------

		const newApp = await Application.create({
			applicantId: session.user.id,
			serviceId: body.serviceId,
			formData: body.formData,
		});

		return NextResponse.json(newApp, { status: 201 });
	} catch (error) {
		console.error("POST Application Error:", error);
		return NextResponse.json(
			{ message: "Error submitting application" },
			{ status: 500 }
		);
	}
}


export async function GET(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session)
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		await connectDB();

		let query = {};
		if (session.user.role === "user") {
			query = { applicantId: session.user.id };
		}

		const applications = await Application.find(query)
			.populate("serviceId", "title description")
			.sort({ createdAt: -1 });

		return NextResponse.json(applications);
	} catch (error) {
		console.error("GET Application Error:", error);
		return NextResponse.json(
			{ message: "Error fetching applications" },
			{ status: 500 }
		);
	}
}

export async function PUT(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session)
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const { id, status, remarks } = await req.json();

		await connectDB();
		const updatedApp = await Application.findByIdAndUpdate(
			id,
			{ status, remarks },
			{ new: true }
		);

		return NextResponse.json(updatedApp);
	} catch (error) {
		console.error("PUT Application Error:", error);
		return NextResponse.json({ message: "Update failed" }, { status: 500 });
	}
}
