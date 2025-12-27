// app/api/applications/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Application from "@/models/Application";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // <--- Import this

export async function POST(req) {
	// PASS authOptions HERE
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		await connectDB();
		const body = await req.json();

		// Check for duplicates
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
			applicantId: session.user.id, // This requires the session callback to run
			serviceId: body.serviceId,
			formData: body.formData,
			status: "pending",
		});

		return NextResponse.json(
			{ message: "Application submitted successfully" },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Application Error:", error); // Check terminal if it fails again
		return NextResponse.json({ error: "Submission failed" }, { status: 500 });
	}
}


// GET: Fetch Applications
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  let query = {};

  // If user is just a citizen, only show their own apps
  if (session.user.role === 'user') {
    query = { applicantId: session.user.id };
  }
  // If Officer/Staff, query remains empty {} so they see ALL apps

  const applications = await Application.find(query)
    .populate('serviceId', 'title description') 
    .sort({ createdAt: -1 });

  return NextResponse.json(applications);
}

// PUT: Update Application Status (Officer Only)
export async function PUT(req) {
  const session = await getServerSession(authOptions);

  // Security: Check if user is Officer or Staff
  if (!session || !['officer', 'staff'].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();
    const { id, status, remarks } = await req.json();

    const updatedApp = await Application.findByIdAndUpdate(
      id, 
      { status, remarks }, 
      { new: true }
    );

    return NextResponse.json(updatedApp);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}