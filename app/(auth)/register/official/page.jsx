"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

export default function RegisterOfficial() {
	// Default to staff
	const [info, setInfo] = useState({
		name: "",
		email: "",
		password: "",
		role: "staff",
	});
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);
	const router = useRouter();

	const handleInput = (e) => {
		setInfo({ ...info, [e.target.name]: e.target.value });
	};

	const setRole = (role) => {
		setInfo({ ...info, role });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!info.name || !info.email || !info.password) {
			setError("Please provide all the details.");
			return;
		}

		try {
			setPending(true);
			// Reuse the same API route
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(info),
			});

			if (res.ok) {
				setPending(false);
				router.push("/login");
			} else {
				const errorData = await res.json();
				setError(errorData.message);
				setPending(false);
			}
		} catch (error) {
			setPending(false);
			setError("Something went wrong.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
			{/* Dark theme background to distinguish from user portal */}
			<div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-slate-200">
				<div className="text-center">
					<div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
						</svg>
					</div>
					<h2 className="text-3xl font-bold text-slate-900 tracking-tight">
						Official Registration
					</h2>
					<p className="mt-2 text-slate-600">
						For Gram Panchayat Officers & Staff only.
					</p>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm text-center">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					{/* Role Selection Cards (Only 2 options now) */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<RoleCard
							selected={info.role === "staff"}
							onClick={() => setRole("staff")}
							title="Staff Member"
							description="Process applications & verify documents."
							color="blue"
							icon={
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" />
							}
						/>

						<RoleCard
							selected={info.role === "officer"}
							onClick={() => setRole("officer")}
							title="Officer (Admin)"
							description="Full access to approve & manage schemes."
							color="indigo"
							icon={<circle cx="12" cy="12" r="10" />}
						/>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Official Name
							</label>
							<input
								name="name"
								type="text"
								required
								onChange={handleInput}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Official Email
							</label>
							<input
								name="email"
								type="email"
								required
								onChange={handleInput}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Secure Password
							</label>
							<input
								name="password"
								type="password"
								required
								onChange={handleInput}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
							/>
						</div>
					</div>

					<button
						disabled={pending}
						className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
					>
						{pending ? (
							<>
								<Spinner />
								<span>Verifying Credentials...</span>
							</>
						) : (
							"Register Official"
						)}
					</button>

					<p className="text-center text-sm text-slate-600">
						Not an official?{" "}
						<Link
							href="/register"
							className="font-medium text-indigo-600 hover:underline"
						>
							Go to User Registration
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}

// Helper Card Component
function RoleCard({ selected, onClick, title, description, icon, color }) {
	const activeClass =
		color === "indigo"
			? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
			: "border-blue-600 bg-blue-50 ring-1 ring-blue-600";

	return (
		<div
			onClick={onClick}
			className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center text-center transition-all duration-200 
        ${
					selected ? activeClass : "border-slate-200 bg-white hover:bg-slate-50"
				}`}
		>
			<div
				className={`mb-3 p-2 rounded-full ${
					selected ? "bg-white" : "bg-slate-100 text-slate-500"
				}`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					{icon}
				</svg>
			</div>
			<h3 className="font-bold text-sm text-slate-800">{title}</h3>
			<p className="text-xs text-slate-500 mt-1">{description}</p>
		</div>
	);
}
