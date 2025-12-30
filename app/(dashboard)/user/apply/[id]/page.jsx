"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import { toast } from "sonner";

export default function ApplyPage({ params }) {
	const { id } = use(params);
	const [formData, setFormData] = useState({});
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleInput = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		
		try {
			const res = await fetch("/api/applications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					serviceId: id,
					formData,
				}),
			});

			const data = await res.json(); // Parse the response immediately

			if (res.ok) {
				toast.success("Application Submitted Successfully!");
				router.push("/user/my-apps");
			} else if (res.status === 409) {
				// ---  Handle Duplicate Error ---
				toast.error("You have already applied for this scheme.");
				setLoading(false);
			} else {
				// Handle generic errors
				toast.error(data.message || "Submission failed. Please try again.");
				setLoading(false);
			}
		} catch (error) {
			toast.error("Something went wrong. Check your connection.");
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto py-10">
			<h1 className="text-2xl font-bold mb-6 text-slate-900">
				Apply for Service
			</h1>

			<form
				onSubmit={handleSubmit}
				className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
			>
				{/* Full Name Input */}
				<div>
					<label className="block text-sm font-medium mb-1 text-slate-700">
						Full Name
					</label>
					<input
						name="fullName"
						onChange={handleInput}
						required
						className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
						placeholder="Enter your full name"
					/>
				</div>

				{/* Notes Input */}
				<div>
					<label className="block text-sm font-medium mb-1 text-slate-700">
						Additional Notes
					</label>
					<textarea
						name="notes"
						onChange={handleInput}
						className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
						rows="4"
						placeholder="Any specific details you want to add..."
					/>
				</div>

				{/* Submit Button */}
				<button
					disabled={loading}
					className="w-full bg-teal-700 text-white py-3 rounded-lg font-bold hover:bg-teal-800 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all shadow-md"
				>
					{loading ? (
						<>
							<Spinner className="text-white" /> Checking Eligibility...
						</>
					) : (
						"Submit Application"
					)}
				</button>
			</form>
		</div>
	);
}
