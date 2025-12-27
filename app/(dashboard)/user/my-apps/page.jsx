"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MyApplications() {
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

	// Helper for Status Colors
	const getStatusColor = (status) => {
		switch (status) {
			case "approved":
				return "bg-teal-100 text-teal-800 border-teal-200";
			case "rejected":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-yellow-100 text-yellow-800 border-yellow-200"; // pending
		}
	};

	if (loading)
		return <div className="p-8 text-slate-500">Loading your history...</div>;

	return (
		<div className="max-w-5xl mx-auto">
			<h1 className="text-2xl font-semibold text-slate-900 mb-6">
				Application Status
			</h1>

			{applications.length === 0 ? (
				<div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
					<p className="text-slate-500 mb-4">
						You haven't applied for any services yet.
					</p>
					<Link
						href="/user/services"
						className="text-teal-700 font-medium hover:underline"
					>
						Browse Services
					</Link>
				</div>
			) : (
				<div className="grid gap-4">
					{applications.map((app) => (
						<div
							key={app._id}
							className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
						>
							{/* Left Side: Info */}
							<div>
								<div className="flex items-center gap-3 mb-1">
									<h3 className="text-lg font-bold text-slate-800">
										{app.serviceId?.title || "Unknown Service"}
									</h3>
									<span
										className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusColor(
											app.status
										)}`}
									>
										{app.status}
									</span>
								</div>
								<p className="text-sm text-slate-500">
									Applied on: {new Date(app.createdAt).toLocaleDateString()}
								</p>

								{/* Remarks Section (Only if Officer added one) */}
								{app.remarks && (
									<div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700">
										<span className="font-semibold">Official Remark:</span>{" "}
										{app.remarks}
									</div>
								)}
							</div>

							{/* Right Side: ID Display */}
							<div className="text-right">
								<span className="text-xs text-slate-400 block mb-1">
									Application ID
								</span>
								<code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-slate-600">
									{app._id.slice(-6).toUpperCase()}
								</code>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
