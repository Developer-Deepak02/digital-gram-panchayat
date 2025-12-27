// app/(auth)/register/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "user",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				router.push("/login");
			} else {
				const data = await res.json();
				setError(data.message || "Registration failed");
			}
		} catch (err) {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
			<div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
				<h2 className="text-2xl font-semibold text-slate-900 text-center">
					Digital Gram Panchayat
				</h2>
				<p className="text-sm text-slate-600 text-center mt-1 mb-6">
					Create a new citizen or official account
				</p>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Full Name */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Full Name
						</label>
						<input
							name="name"
							type="text"
							required
							placeholder="John Doe"
							onChange={handleChange}
							className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-slate-900
							focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
						/>
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Email Address
						</label>
						<input
							name="email"
							type="email"
							required
							placeholder="example@xyz.com"
							onChange={handleChange}
							className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-slate-900
							focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
						/>
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Password
						</label>
						<div className="relative">
							<input
								name="password"
								type={showPassword ? "text" : "password"}
								required
								placeholder="••••••••"
								onChange={handleChange}
								className="w-full px-3 py-2 pr-10 rounded-md bg-slate-50 border border-slate-300 text-slate-900
								focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
							/>

							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
							>
								{showPassword ? (
									// eye-off
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 cursor-pointer"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.9 21.9 0 0 1 5.06-6.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.9 21.9 0 0 1-2.17 3.19" />
										<path d="M1 1l22 22" />
									</svg>
								) : (
									// eye
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 cursor-pointer"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
										<circle cx="12" cy="12" r="3" />
									</svg>
								)}
							</button>
						</div>
					</div>

					{/* Role */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Role (For Testing)
						</label>
						<select
							name="role"
							onChange={handleChange}
							className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-300 text-slate-900
							focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
						>
							<option value="user">Citizen (User)</option>
							<option value="staff">Staff Member</option>
							<option value="officer">Officer (Admin)</option>
						</select>
					</div>

					{/* Button */}
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-teal-700 text-white py-2.5 rounded-md font-medium
						hover:bg-teal-800 transition disabled:bg-teal-600 cursor-pointer"
					>
						{loading ? "Creating account..." : "Register"}
					</button>
				</form>

				<p className="mt-5 text-center text-sm text-slate-600">
					Already have an account?{" "}
					<Link
						href="/login"
						className="text-teal-700 font-medium hover:underline"
					>
						Login here
					</Link>
				</p>
			</div>
		</div>
	);
}
