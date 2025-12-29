"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function UserProfile() {
	const { data: session } = useSession();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);

	// Form State
	const [formData, setFormData] = useState({
		phone: "",
		address: "",
	});

	// 1. Fetch User Data
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await fetch("/api/profile");
				const data = await res.json();

				if (res.ok) {
					setUser(data);
					setFormData({
						phone: data.phone || "",
						address: data.address || "",
					});
				}
			} catch (error) {
				console.error("Failed to load profile");
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	// 2. Handle Save
	const handleSave = async () => {
		try {
			const res = await fetch("/api/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				const updatedUser = await res.json();
				setUser(updatedUser);
				setIsEditing(false);
				alert("Profile updated successfully!");
			} else {
				alert("Failed to update profile.");
			}
		} catch (error) {
			alert("Something went wrong.");
		}
	};

	if (loading)
		return <div className="p-8 text-slate-500">Loading profile...</div>;
	if (!user)
		return <div className="p-8 text-red-500">Error loading profile.</div>;

	return (
		<div className="max-w-4xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
					<p className="text-slate-600 mt-1">
						Manage your personal information.
					</p>
				</div>
				{!isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 transition shadow-sm"
					>
						Edit Profile
					</button>
				)}
			</div>

			<div className="bg-white border border-slate-200 rounded-xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
				{/* Header Section with Avatar Placeholder */}
				<div className="flex items-center gap-6 border-b border-slate-100 pb-8 mb-8">
					<div className="w-20 h-20 bg-teal-700 rounded-full flex items-center justify-center text-white text-2xl font-bold uppercase shadow-md">
						{user.name ? user.name.substring(0, 2) : "User"}
					</div>
					<div>
						<h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
						<p className="text-slate-500">{user.email}</p>
						<span className="inline-block mt-2 px-2.5 py-0.5 rounded text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100 uppercase tracking-wide">
							{user.role} Account
						</span>
					</div>
				</div>

				{/* Form Section */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
					{/* Read-Only Fields */}
					<div>
						<label className="block text-sm font-medium text-slate-500 mb-1">
							Full Name
						</label>
						<input
							type="text"
							value={user.name}
							disabled
							className="w-full px-3 py-2 rounded-md bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-500 mb-1">
							Email Address
						</label>
						<input
							type="text"
							value={user.email}
							disabled
							className="w-full px-3 py-2 rounded-md bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"
						/>
					</div>

					{/* Editable Fields */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Phone Number
						</label>
						<input
							type="text"
							value={isEditing ? formData.phone : user.phone || "Not provided"}
							disabled={!isEditing}
							onChange={(e) =>
								setFormData({ ...formData, phone: e.target.value })
							}
							placeholder="e.g. +91 98765 43210"
							className={`w-full px-3 py-2 rounded-md border text-slate-900 transition
                ${
									isEditing
										? "bg-slate-50 border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
										: "bg-white border-transparent px-0 text-slate-800 font-medium"
								}`}
						/>
					</div>

					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Residential Address
						</label>
						<textarea
							rows="3"
							value={
								isEditing ? formData.address : user.address || "Not provided"
							}
							disabled={!isEditing}
							onChange={(e) =>
								setFormData({ ...formData, address: e.target.value })
							}
							placeholder="Enter your full address..."
							className={`w-full px-3 py-2 rounded-md border text-slate-900 transition
                ${
									isEditing
										? "bg-slate-50 border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
										: "bg-white border-transparent px-0 text-slate-800 font-medium resize-none"
								}`}
						/>
					</div>
				</div>

				{/* Action Buttons (Only visible when editing) */}
				{isEditing && (
					<div className="mt-8 flex gap-3 justify-end pt-6 border-t border-slate-100">
						<button
							onClick={() => setIsEditing(false)}
							className="px-4 py-2 bg-slate-100 text-slate-600 rounded-md text-sm font-medium hover:bg-slate-200 transition"
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							className="px-6 py-2 bg-teal-700 text-white rounded-md text-sm font-medium hover:bg-teal-800 transition shadow-sm"
						>
							Save Changes
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
