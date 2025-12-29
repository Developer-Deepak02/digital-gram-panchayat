"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterUser() {
	// 1. Role is hardcoded to 'user'
	const [info, setInfo] = useState({
		name: "",
		email: "",
		password: "",
		role: "user",
	});
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);
	const router = useRouter();

	const handleInput = (e) => {
		setInfo({ ...info, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!info.name || !info.email || !info.password) {
			setError("Please provide all the details.");
			return;
		}

		try {
			setPending(true);
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
		<div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100">
				<div className="text-center">
					<div className="w-12 h-12 bg-teal-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-teal-900/20">
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
							<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
							<circle cx="8.5" cy="7" r="4" />
							<line x1="20" y1="8" x2="20" y2="14" />
							<line x1="23" y1="11" x2="17" y2="11" />
						</svg>
					</div>
					<h2 className="text-3xl font-bold text-slate-900 tracking-tight">
						Citizen Registration
					</h2>
					<p className="mt-2 text-slate-600">
						Create your account to access services.
					</p>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm text-center">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Full Name
							</label>
							<input
								name="name"
								type="text"
								required
								onChange={handleInput}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
								placeholder="e.g. Rahul Kumar"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Email Address
							</label>
							<input
								name="email"
								type="email"
								required
								onChange={handleInput}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
								placeholder="name@example.com"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Password
							</label>
							<input
								name="password"
								type="password"
								required
								onChange={handleInput}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
								placeholder="••••••••"
							/>
						</div>
					</div>

					<button
						disabled={pending}
						className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 disabled:bg-teal-300 transition-all"
					>
						{pending ? "Creating Account..." : "Register"}
					</button>

					<div className="text-center space-y-2">
						<p className="text-sm text-slate-600">
							Already have an account?{" "}
							<Link
								href="/login"
								className="font-medium text-teal-700 hover:text-teal-600"
							>
								Sign in
							</Link>
						</p>
					
					</div>
				</form>
			</div>
		</div>
	);
}
