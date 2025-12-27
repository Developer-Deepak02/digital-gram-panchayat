import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { getServerSession } from "next-auth";

// GET: Fetch all services (Public or Authenticated)
export async function GET(request) {
	await connectDB();
	const services = await Service.find({}).sort({ createdAt: -1 });
	return NextResponse.json(services);
}

// POST: Create a service (Officer Only)
export async function POST(request) {
	const session = await getServerSession();

	// RBAC Check
	if (!session || session.user.role !== "officer") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
	}

	await connectDB();
	const body = await request.json();

	const newService = await Service.create({
		...body,
		createdBy: session.user.id,
	});

	return NextResponse.json(newService, { status: 201 });
}
