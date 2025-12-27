// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ["user", "staff", "officer"],
			default: "user",
		},
		phone: { type: String },
		address: { type: String },
	},
	{ timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
