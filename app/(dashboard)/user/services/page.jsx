"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BrowseServices() {
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [applyingFor, setApplyingFor] = useState(null); // ID of service being applied to
	const [formText, setFormText] = useState("");
	const router = useRouter();

	useEffect(() => {
		fetch("/api/services")
			.then((res) => res.json())
			.then((data) => {
				setServices(data);
				setLoading(false);
			});
	}, []);

	const handleApply = async (serviceId) => {
		try {
			const res = await fetch("/api/applications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					serviceId,
					formData: { notes: formText }, // Simple data for now
				}),
			});

			if (res.ok) {
				alert("Application Submitted Successfully!");
				setApplyingFor(null);
				setFormText("");
				router.push("/user/my-apps"); // Redirect to status page
			} else {
				const err = await res.json();
				alert(err.message || "Failed to apply");
			}
		} catch (error) {
			alert("Something went wrong");
		}
	};

	if (loading)
		return <div className="p-8 text-slate-500">Loading services...</div>;

	return (
		<div className="max-w-6xl mx-auto">
			<div className="mb-8">
				<h1 className="text-2xl font-semibold text-slate-900">
					Available Services
				</h1>
				<p className="text-slate-600 mt-1">
					Browse and apply for government schemes.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{services.length === 0 && (
					<p className="text-slate-500">No services available at the moment.</p>
				)}

				{services.map((service) => (
					<div
						key={service._id}
						className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex flex-col h-full"
					>
						<div className="flex-1">
							<h3 className="text-xl font-bold text-slate-800 mb-2">
								{service.title}
							</h3>
							<p className="text-slate-600 text-sm mb-4 leading-relaxed">
								{service.description}
							</p>

							<div className="flex flex-wrap gap-2 mb-6">
								<span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
									Eligible: {service.eligibility}
								</span>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
									Docs: {service.documentsRequired}
								</span>
							</div>
						</div>

						{/* Application Section */}
						<div className="pt-4 border-t border-slate-100 mt-auto">
							{applyingFor === service._id ? (
								<div className="animate-in fade-in slide-in-from-top-2 duration-300">
									<label className="block text-xs font-semibold text-slate-700 mb-1">
										Additional Notes (Optional)
									</label>
									<textarea
										className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 mb-3"
										rows="2"
										placeholder="Enter details if required..."
										value={formText}
										onChange={(e) => setFormText(e.target.value)}
									/>
									<div className="flex gap-2">
										<button
											onClick={() => handleApply(service._id)}
											className="flex-1 bg-teal-700 text-white text-sm py-2 rounded-md font-medium hover:bg-teal-800 transition"
										>
											Confirm Submit
										</button>
										<button
											onClick={() => setApplyingFor(null)}
											className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-md font-medium hover:bg-slate-200 transition"
										>
											Cancel
										</button>
									</div>
								</div>
							) : (
								<button
									onClick={() => setApplyingFor(service._id)}
									className="w-full bg-white border-2 border-teal-700 text-teal-700 py-2 rounded-md font-semibold hover:bg-teal-50 transition text-sm"
								>
									Apply Now
								</button>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
