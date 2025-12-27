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
		role: "user", // Default role
		phone: "",
		address: "",
	});
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
				// Redirect to login page on success
				router.push("/login");
			} else {
				const data = await res.json();
				setError(data.message);
			}
		} catch (err) {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 bg-white rounded shadow-md">
				<h2 className="text-2xl font-bold text-center mb-6">
					Create an Account
				</h2>

				{error && (
					<div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Name */}
					<div>
						<label className="block text-sm font-medium mb-1">Full Name</label>
						<input
							name="name"
							type="text"
							required
							onChange={handleChange}
							className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm font-medium mb-1">Email</label>
						<input
							name="email"
							type="email"
							required
							onChange={handleChange}
							className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium mb-1">Password</label>
						<input
							name="password"
							type="password"
							required
							onChange={handleChange}
							className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Role (For Testing Only) */}
					<div>
						<label className="block text-sm font-medium mb-1">
							Role (Select for Testing)
						</label>
						<select
							name="role"
							onChange={handleChange}
							className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
						>
							<option value="user">Citizen (User)</option>
							<option value="staff">Staff Member</option>
							<option value="officer">Officer (Admin)</option>
						</select>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
					>
						{loading ? "Registering..." : "Register"}
					</button>
				</form>

				<p className="mt-4 text-center text-sm text-gray-600">
					Already have an account?{" "}
					<Link href="/login" className="text-blue-600 hover:underline">
						Login here
					</Link>
				</p>
			</div>
		</div>
	);
}
