"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Spinner from "@/components/ui/Spinner";

export default function UserProfile() {
	const { data: session, update } = useSession();
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		mobile: "",
	});

	// Load session data into form when page loads
	useEffect(() => {
		if (session?.user) {
			setFormData({
				name: session.user.name || "",
				email: session.user.email || "",
				mobile: session.user.mobile || "",
			});
		}
	}, [session]);

	const handleCopyId = () => {
		if (session?.user?.id) {
			navigator.clipboard.writeText(session.user.id);
			toast.success("User ID copied to clipboard!");
		}
	};

	const handleInput = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// --- FIX IS HERE: Reset data on Cancel ---
	const handleCancel = () => {
		// Revert to original session data
		if (session?.user) {
			setFormData({
				name: session.user.name || "",
				email: session.user.email || "",
				mobile: session.user.mobile || "",
			});
		}
		setIsEditing(false);
	};

	const handleSave = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				await update({
					...session,
					user: { ...session.user, ...formData },
				});
				toast.success("Profile updated successfully!");
				setIsEditing(false);
			} else {
				toast.error("Failed to update profile.");
			}
		} catch (error) {
			toast.error("Something went wrong.");
		}
		setLoading(false);
	};

	if (!session) return null;

	return (
		<div className="max-w-3xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

				{!isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className="text-sm font-medium text-teal-700 bg-teal-50 px-4 py-2 rounded-lg border border-teal-100 hover:bg-teal-100 transition"
					>
						Edit Profile
					</button>
				)}
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
				<div className="bg-teal-700 h-28 relative">
					<div className="absolute -bottom-10 left-8">
						<div className="w-24 h-24 bg-teal-100 text-teal-800 rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold shadow-sm">
							{session.user.name?.charAt(0).toUpperCase()}
						</div>
					</div>
				</div>

				<div className="pt-14 px-8 pb-8">
					{/* Name Section */}
					{!isEditing ? (
						<div>
							<h2 className="text-2xl font-bold text-slate-900">
								{formData.name}
							</h2>
							<p className="text-slate-500 text-sm capitalize">
								{session.user.role} Account
							</p>
						</div>
					) : (
						<div className="mb-4">
							<label className="block text-xs font-bold text-slate-500 uppercase mb-1">
								Full Name
							</label>
							<input
								name="name"
								value={formData.name}
								onChange={handleInput}
								className="text-xl font-bold text-slate-900 border-b-2 border-teal-500 outline-none w-full pb-1 focus:bg-slate-50"
							/>
						</div>
					)}

					<div className="mt-8 space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Email Field */}
							<div className="p-5 bg-slate-50 rounded-lg border border-slate-100">
								<p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
									Email Address
								</p>
								{!isEditing ? (
									<p className="text-slate-700 font-medium break-all">
										{formData.email}
									</p>
								) : (
									<input
										name="email"
										value={formData.email}
										onChange={handleInput}
										className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 focus:ring-2 focus:ring-teal-500 outline-none"
									/>
								)}
							</div>

							{/* Mobile Field (Only visible if exists or editing) */}
							{(formData.mobile || isEditing) && (
								<div className="p-5 bg-slate-50 rounded-lg border border-slate-100">
									<p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
										Mobile Number
									</p>
									{!isEditing ? (
										<p className="text-slate-700 font-medium">
											{formData.mobile}
										</p>
									) : (
										<input
											name="mobile"
											value={formData.mobile}
											onChange={handleInput}
											placeholder="Enter mobile number"
											className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 focus:ring-2 focus:ring-teal-500 outline-none"
										/>
									)}
								</div>
							)}

							{/* User ID */}
							<div
								className="p-5 bg-slate-50 rounded-lg border border-slate-100 relative group cursor-pointer"
								onClick={handleCopyId}
							>
								<p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
									User ID
								</p>
								<p className="text-slate-700 font-medium font-mono text-sm truncate">
									{session.user.id}
								</p>
								<span className="absolute top-4 right-4 text-slate-400 opacity-0 group-hover:opacity-100 transition text-xs">
									Copy
								</span>
							</div>
						</div>

						{/* Action Buttons */}
						{isEditing && (
							<div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
								{/* Cancel Button uses the new handleCancel function */}
								<button
									onClick={handleCancel}
									className="px-6 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition"
								>
									Cancel
								</button>
								<button
									onClick={handleSave}
									disabled={loading}
									className="px-6 py-2 rounded-lg bg-teal-700 text-white font-medium hover:bg-teal-800 transition shadow-sm flex items-center gap-2"
								>
									{loading && <Spinner className="w-4 h-4 text-white" />}
									Save Changes
								</button>
							</div>
						)}

						<div className="pt-2">
							<div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md border border-green-100 w-fit">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
									<polyline points="22 4 12 14.01 9 11.01" />
								</svg>
								Active & Verified
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
