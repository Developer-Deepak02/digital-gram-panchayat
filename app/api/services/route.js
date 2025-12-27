// app/api/services/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { getServerSession } from "next-auth";

// GET: Fetch all services (Used by Everyone)
export async function GET() {
	await connectDB();
	const services = await Service.find({}).sort({ createdAt: -1 });
	return NextResponse.json(services);
}

// POST: Create a new service (Officer Only)
export async function POST(req) {
	const session = await getServerSession();

	// Security Check: Only Officers can create services
	// Note: In production, pass 'authOptions' to getServerSession to read the role correctly
	// For now, we assume the session exists.

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await req.json();
		await connectDB();

		const newService = await Service.create({
			...body,
			createdBy: session.user?.id,
		});

		return NextResponse.json(newService, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create service" },
			{ status: 500 }
		);
	}
}

// DELETE: Remove a service
export async function DELETE(req) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");

	await connectDB();
	await Service.findByIdAndDelete(id);

	return NextResponse.json({ message: "Deleted" });
}
