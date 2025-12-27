// models/Application.js
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
	{
		applicantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		serviceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Service",
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "in-progress", "approved", "rejected"],
			default: "pending",
		},
		remarks: { type: String, default: "" }, // Admin comments
		formData: { type: Object }, // User submitted details
	},
	{ timestamps: true }
);

export default mongoose.models.Application ||
	mongoose.model("Application", ApplicationSchema);
