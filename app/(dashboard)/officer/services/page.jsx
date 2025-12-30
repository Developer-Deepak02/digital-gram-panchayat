"use client";

import { useState, useEffect } from "react";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { toast } from "sonner";

export default function OfficerServices() {
	const [schemes, setSchemes] = useState([]);

	// FIX 1: Updated state key from 'documents' to 'documentsRequired'
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		eligibility: "",
		documentsRequired: "",
	});

	const [loading, setLoading] = useState(true);

	// Modal State
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [schemeToDeleteId, setSchemeToDeleteId] = useState(null);

	useEffect(() => {
		fetchSchemes();
	}, []);

	const fetchSchemes = async () => {
		try {
			const res = await fetch("/api/services");
			const data = await res.json();
			setSchemes(data);
			setLoading(false);
		} catch (error) {
			toast.error("Failed to load schemes.");
			setLoading(false);
		}
	};

	const handleInput = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const toastId = toast.loading("Publishing scheme...");

		try {
			const res = await fetch("/api/services", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				// FIX 2: Reset the correct field name
				setFormData({
					title: "",
					description: "",
					eligibility: "",
					documentsRequired: "",
				});
				fetchSchemes();
				toast.dismiss(toastId);
				toast.success("New scheme published successfully!");
			} else {
				toast.dismiss(toastId);
				toast.error("Failed to create scheme. Try again.");
			}
		} catch (error) {
			toast.dismiss(toastId);
			toast.error("Something went wrong.");
		}
	};

	const initiateDelete = (id) => {
		setSchemeToDeleteId(id);
		setIsDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (!schemeToDeleteId) return;
		const toastId = toast.loading("Deleting scheme...");

		try {
			const res = await fetch(`/api/services?id=${schemeToDeleteId}`, {
				method: "DELETE",
			});

			if (res.ok) {
				fetchSchemes();
				toast.dismiss(toastId);
				toast.success("Scheme deleted successfully.");
			} else {
				toast.dismiss(toastId);
				toast.error("Failed to delete scheme.");
			}
		} catch (error) {
			toast.dismiss(toastId);
			toast.error("Error deleting scheme.");
		}
		setSchemeToDeleteId(null);
	};

	if (loading)
		return <div className="p-8 text-slate-500">Loading schemes...</div>;

	return (
		<div className="max-w-4xl mx-auto relative">
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={confirmDelete}
				title="Delete Scheme"
				message="Are you sure you want to delete this scheme? This action cannot be undone."
			/>

			<h1 className="text-2xl font-bold text-slate-900 mb-6">Manage Schemes</h1>

			{/* Create Scheme Form */}
			<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
				<h2 className="text-lg font-bold text-teal-700 mb-4">Add New Scheme</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Scheme Title
						</label>
						<input
							name="title"
							value={formData.title}
							onChange={handleInput}
							type="text"
							required
							className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none transition"
							placeholder="e.g. Housing Support 2025"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Description
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleInput}
							required
							className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none transition"
							rows="3"
							placeholder="Describe the scheme details..."
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Eligibility
							</label>
							<input
								name="eligibility"
								value={formData.eligibility}
								onChange={handleInput}
								type="text"
								required
								className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none transition"
								placeholder="e.g. Income < 2 Lakhs"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Documents Required
							</label>
							{/* FIX 3: Updated input name and value binding */}
							<input
								name="documentsRequired"
								value={formData.documentsRequired}
								onChange={handleInput}
								type="text"
								required
								className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none transition"
								placeholder="e.g. Aadhar, Pan Card"
							/>
						</div>
					</div>
					<button className="bg-teal-700 text-white px-6 py-2 rounded-md font-medium hover:bg-teal-800 transition shadow-sm">
						Publish Scheme
					</button>
				</form>
			</div>

			{/* Existing Schemes List */}
			<h2 className="text-xl font-bold text-slate-900 mb-4">
				Existing Schemes
			</h2>
			<div className="space-y-4">
				{schemes.map((scheme) => (
					<div
						key={scheme._id}
						className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start group hover:border-teal-200 transition"
					>
						<div>
							<h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-700 transition">
								{scheme.title}
							</h3>
							<p className="text-slate-600 mt-1 text-sm">
								{scheme.description}
							</p>
							<div className="flex gap-4 mt-3 text-xs text-slate-500">
								<span className="bg-slate-100 px-2 py-1 rounded">
									Eligibility: {scheme.eligibility}
								</span>
								{/* FIX 4: Rendering the correct field name from API */}
								<span className="bg-slate-100 px-2 py-1 rounded">
									Docs: {scheme.documentsRequired}
								</span>
							</div>
						</div>

						<button
							onClick={() => initiateDelete(scheme._id)}
							className="bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-100 hover:text-red-700 transition border border-red-100"
						>
							Delete
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
