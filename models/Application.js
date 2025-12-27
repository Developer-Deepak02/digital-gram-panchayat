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
		remarks: { type: String }, // For Officer/Staff comments
		submissionDetails: { type: Object }, // To store form data specific to the service
	},
	{ timestamps: true }
);

export default mongoose.models.Application ||
	mongoose.model("Application", ApplicationSchema);
