"use client";

import { useState, useEffect } from "react";

export default function OfficerApplications() {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/applications")
			.then((res) => res.json())
			.then((data) => {
				setApplications(data);
				setLoading(false);
			});
	}, []);

	const handleUpdateStatus = async (id, newStatus, currentRemarks) => {
		let remarks = currentRemarks || "";
		if (newStatus === "rejected") {
			remarks = prompt("Enter reason for rejection (optional):") || "";
		} else if (newStatus === "approved") {
			remarks = "Approved by Officer";
		}

		try {
			const res = await fetch("/api/applications", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, status: newStatus, remarks }),
			});

			if (res.ok) {
				setApplications((apps) =>
					apps.map((app) =>
						app._id === id ? { ...app, status: newStatus, remarks } : app
					)
				);
			}
		} catch (error) {
			alert("Failed to update status");
		}
	};

	const getStatusBadge = (status) => {
		const styles = {
			pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
			approved: "bg-teal-100 text-teal-800 border-teal-200",
			rejected: "bg-red-100 text-red-800 border-red-200",
			"in-progress": "bg-blue-100 text-blue-800 border-blue-200",
		};
		return (
			<span
				className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
					styles[status] || styles.pending
				}`}
			>
				{status}
			</span>
		);
	};

	if (loading)
		return <div className="p-8 text-slate-500">Loading applications...</div>;

	return (
		<div className="max-w-6xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900">
						Application Approvals
					</h1>
					<p className="text-slate-600 mt-1">
						Review and manage citizen requests.
					</p>
				</div>
				<div className="bg-white px-4 py-2 rounded-md border border-slate-200 shadow-sm text-sm text-slate-600">
					Total Requests:{" "}
					<span className="font-bold text-slate-900">
						{applications.length}
					</span>
				</div>
			</div>

			<div className="grid gap-4">
				{applications.length === 0 && (
					<p className="text-slate-500 italic">No applications found.</p>
				)}

				{applications.map((app) => (
					<div
						key={app._id}
						className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row gap-6 justify-between items-start"
					>
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<h3 className="text-lg font-bold text-slate-800">
									{app.serviceId?.title || "Unknown Scheme"}
								</h3>
								{getStatusBadge(app.status)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600 mt-3">
								<p>
									<span className="font-semibold text-slate-900">
										Applicant ID:
									</span>{" "}
									{app.applicantId}
								</p>
								<p>
									<span className="font-semibold text-slate-900">
										Applied Date:
									</span>{" "}
									{new Date(app.createdAt).toLocaleDateString()}
								</p>

								{app.formData && app.formData.notes && (
									<div className="col-span-2 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
										<span className="font-semibold text-slate-900">
											User Notes:
										</span>{" "}
										{app.formData.notes}
									</div>
								)}
							</div>

							{app.remarks && (
								<p className="mt-3 text-xs text-slate-500">
									<span className="font-bold">Last Remark:</span> {app.remarks}
								</p>
							)}
						</div>

						{/* --- FIX IS HERE: Allow actions for 'pending' OR 'in-progress' --- */}
						{(app.status === "pending" || app.status === "in-progress") && (
							<div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
								<button
									onClick={() =>
										handleUpdateStatus(app._id, "approved", app.remarks)
									}
									className="flex-1 bg-teal-700 text-white px-4 py-2 rounded-md font-medium hover:bg-teal-800 transition shadow-sm text-sm"
								>
									Approve
								</button>
								<button
									onClick={() =>
										handleUpdateStatus(app._id, "rejected", app.remarks)
									}
									className="flex-1 bg-white border border-red-200 text-red-700 px-4 py-2 rounded-md font-medium hover:bg-red-50 transition shadow-sm text-sm"
								>
									Reject
								</button>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
