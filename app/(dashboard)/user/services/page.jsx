"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function UserServices() {
	const [schemes, setSchemes] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/services")
			.then((res) => res.json())
			.then((data) => {
				setSchemes(data);
				setLoading(false);
			})
			.catch((err) => {
				toast.error("Failed to load available schemes.");
				setLoading(false);
			});
	}, []);

	if (loading)
		return <div className="p-8 text-slate-500">Loading services...</div>;

	return (
		<div className="max-w-5xl mx-auto">
			<h1 className="text-2xl font-bold text-slate-900 mb-2">
				Available Services
			</h1>
			<p className="text-slate-600 mb-8">
				Browse and apply for government schemes.
			</p>

			<div className="grid md:grid-cols-2 gap-6">
				{schemes.map((scheme) => (
					<div
						key={scheme._id}
						className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-teal-200 transition group flex flex-col h-full"
					>
						<div className="flex-1">
							<h3 className="text-xl font-bold text-slate-800 group-hover:text-teal-700 transition">
								{scheme.title}
							</h3>
							<p className="text-slate-600 mt-2 text-sm leading-relaxed">
								{scheme.description}
							</p>

							<div className="flex flex-wrap gap-2 mt-4">
								<span className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-xs font-medium border border-teal-100">
									Eligible: {scheme.eligibility}
								</span>
								<span className="bg-slate-50 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-100">
									Docs: {scheme.documentsRequired}
								</span>
							</div>
						</div>

						<div className="mt-6 pt-4 border-t border-slate-50">
							<Link
								href={`/user/apply/${scheme._id}`}
								className="block w-full text-center bg-white text-teal-700 border border-teal-200 py-2.5 rounded-lg font-medium hover:bg-teal-700 hover:text-white transition shadow-sm"
							>
								Apply Now
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
