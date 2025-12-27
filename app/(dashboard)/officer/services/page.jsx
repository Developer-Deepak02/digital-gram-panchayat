"use client";

import { useState, useEffect } from "react";

export default function ServiceManagement() {
	const [services, setServices] = useState([]);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		eligibility: "",
		documentsRequired: "",
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchServices();
	}, []);

	const fetchServices = async () => {
		const res = await fetch("/api/services");
		const data = await res.json();
		setServices(data);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await fetch("/api/services", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				setFormData({
					title: "",
					description: "",
					eligibility: "",
					documentsRequired: "",
				});
				fetchServices();
			}
		} catch (error) {
			alert("Failed to create service");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this scheme?")) return;
		await fetch(`/api/services?id=${id}`, { method: "DELETE" });
		fetchServices();
	};

	return (
		<div className="max-w-5xl mx-auto">
			<h1 className="text-2xl font-semibold text-slate-900 mb-6">
				Manage Schemes
			</h1>

			{/* --- CREATE SERVICE FORM --- */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] mb-8">
				<h2 className="text-lg font-medium text-teal-800 mb-4 border-b border-slate-100 pb-2">
					Add New Scheme
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Scheme Title
						</label>
						<input
							type="text"
							placeholder="e.g. Housing Support 2025"
							className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Description
						</label>
						<textarea
							placeholder="Describe the scheme details..."
							className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
							rows="3"
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							required
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Eligibility
							</label>
							<input
								type="text"
								placeholder="e.g. Income < 2 Lakhs"
								className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
								value={formData.eligibility}
								onChange={(e) =>
									setFormData({ ...formData, eligibility: e.target.value })
								}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Documents Required
							</label>
							<input
								type="text"
								placeholder="e.g. Aadhar, Pan Card"
								className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
								value={formData.documentsRequired}
								onChange={(e) =>
									setFormData({
										...formData,
										documentsRequired: e.target.value,
									})
								}
								required
							/>
						</div>
					</div>

					<div className="pt-2">
						<button
							type="submit"
							disabled={loading}
							className="bg-teal-700 text-white py-2 px-6 rounded-md font-medium hover:bg-teal-800 transition disabled:bg-teal-600"
						>
							{loading ? "Publishing..." : "Publish Scheme"}
						</button>
					</div>
				</form>
			</div>

			{/* --- LIST OF SERVICES --- */}
			<h2 className="text-lg font-medium text-slate-700 mb-4">
				Existing Schemes
			</h2>
			<div className="grid gap-4">
				{services.length === 0 && (
					<p className="text-slate-500 italic">
						No schemes found. Create one above.
					</p>
				)}

				{services.map((service) => (
					<div
						key={service._id}
						className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start hover:shadow-md transition"
					>
						<div>
							<h3 className="text-lg font-semibold text-slate-900">
								{service.title}
							</h3>
							<p className="text-slate-600 mt-1 text-sm">
								{service.description}
							</p>
							<div className="mt-3 flex gap-4 text-xs text-slate-500">
								<span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
									<strong>Eligibility:</strong> {service.eligibility}
								</span>
								<span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
									<strong>Docs:</strong> {service.documentsRequired}
								</span>
							</div>
						</div>
						<button
							onClick={() => handleDelete(service._id)}
							className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded-md transition"
						>
							Delete
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
