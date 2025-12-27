import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Application from "@/models/Application";
import { getServerSession } from "next-auth";

// POST: Apply for a service (User Only)
export async function POST(request) {
	const session = await getServerSession();
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	await connectDB();
	const body = await request.json();

	const newApp = await Application.create({
		applicantId: session.user.id,
		serviceId: body.serviceId,
		submissionDetails: body.formData,
		status: "pending",
	});

	return NextResponse.json(newApp, { status: 201 });
}

// PUT: Update Status (Staff or Officer)
export async function PUT(request) {
	const session = await getServerSession();
	// Allow Staff or Officer
	if (!session || !["staff", "officer"].includes(session.user.role)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
	}

	await connectDB();
	const { id, status, remarks } = await request.json();

	// Update logic
	const updatedApp = await Application.findByIdAndUpdate(
		id,
		{ status, remarks },
		{ new: true }
	);

	return NextResponse.json(updatedApp);
}
