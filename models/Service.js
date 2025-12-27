// models/Service.js
import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		eligibility: { type: String, required: true },
		documentsRequired: { type: String, required: true }, // Simple string for now (e.g., "Aadhar, Pan Card")
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

export default mongoose.models.Service ||
	mongoose.model("Service", ServiceSchema);
