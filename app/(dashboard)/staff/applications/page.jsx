"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function StaffDashboard() {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/applications")
			.then((res) => res.json())
			.then((data) => {
				setApplications(data);
				setLoading(false);
			})
			.catch((err) => {
				toast.error("Failed to load applications.");
				setLoading(false);
			});
	}, []);

	const handleStatusUpdate = async (id, newStatus) => {
		const remarks =
			newStatus === "in-progress"
				? "Application verified, processing started."
				: "Status updated by Staff.";

		// Loading Toast
		const toastId = toast.loading("Updating status...");

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
				toast.dismiss(toastId);
				toast.success("Status updated successfully!");
			} else {
				toast.dismiss(toastId);
				toast.error("Update failed.");
			}
		} catch (error) {
			toast.dismiss(toastId);
			toast.error("Network error.");
		}
	};

	const getStatusBadge = (status) => {
		const styles = {
			pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
			"in-progress": "bg-blue-100 text-blue-800 border-blue-200",
			approved: "bg-teal-100 text-teal-800 border-teal-200",
			rejected: "bg-red-100 text-red-800 border-red-200",
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
		return <div className="p-8 text-slate-500">Loading tasks...</div>;

	return (
		<div className="max-w-6xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900">
						Staff Portal
					</h1>
					<p className="text-slate-600 mt-1">
						Process applications and verifications.
					</p>
				</div>

				<div className="flex gap-3">
					<div className="bg-white px-4 py-2 rounded-md border border-slate-200 shadow-sm text-sm">
						<span className="text-slate-500 block text-xs uppercase font-bold">
							Pending
						</span>
						<span className="text-xl font-bold text-yellow-600">
							{applications.filter((a) => a.status === "pending").length}
						</span>
					</div>
					<div className="bg-white px-4 py-2 rounded-md border border-slate-200 shadow-sm text-sm">
						<span className="text-slate-500 block text-xs uppercase font-bold">
							In Progress
						</span>
						<span className="text-xl font-bold text-blue-600">
							{applications.filter((a) => a.status === "in-progress").length}
						</span>
					</div>
				</div>
			</div>

			<div className="grid gap-4">
				{applications.length === 0 && (
					<p className="text-slate-500 italic">No applications to process.</p>
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

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600 mt-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
								<p>
									<span className="font-semibold text-slate-900">
										Applicant ID:
									</span>{" "}
									{app.applicantId}
								</p>
								<p>
									<span className="font-semibold text-slate-900">Date:</span>{" "}
									{new Date(app.createdAt).toLocaleDateString()}
								</p>
								<p className="col-span-2 mt-1">
									<span className="font-semibold text-slate-900">
										User Notes:
									</span>{" "}
									{app.formData?.notes || "None"}
								</p>
							</div>

							{app.remarks && (
								<p className="mt-3 text-xs text-slate-500">
									<span className="font-bold">Latest Remark:</span>{" "}
									{app.remarks}
								</p>
							)}
						</div>

						<div className="flex flex-col gap-3 min-w-[200px]">
							{app.status === "pending" && (
								<button
									onClick={() => handleStatusUpdate(app._id, "in-progress")}
									className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-sm text-sm flex items-center justify-center gap-2"
								>
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
										<polyline points="9 11 12 14 22 4" />
										<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
									</svg>
									Start Processing
								</button>
							)}

							{app.status === "in-progress" && (
								<div className="text-center p-3 bg-blue-50 text-blue-800 text-xs font-semibold rounded border border-blue-100">
									Ready for Officer Review
								</div>
							)}

							{(app.status === "approved" || app.status === "rejected") && (
								<div className="text-center p-3 bg-slate-50 text-slate-500 text-xs font-medium rounded border border-slate-100">
									Process Completed
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
