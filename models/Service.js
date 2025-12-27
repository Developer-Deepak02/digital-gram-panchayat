import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		eligibility: { type: String },
		documentsRequired: [{ type: String }], // Array of strings listing docs
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Links to Officer
		},
	},
	{ timestamps: true }
);

export default mongoose.models.Service ||
	mongoose.model("Service", ServiceSchema);
