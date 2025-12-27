"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const res = await signIn("credentials", {
				email,
				password,
				redirect: false, // We handle redirect manually
			});

			if (res.error) {
				setError("Invalid Credentials");
				setLoading(false);
				return;
			}

			// Success! Redirect to home (The DashboardLayout will handle routing from there)
			router.replace("/");
			router.refresh(); // Ensure the session updates immediately
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 bg-white rounded shadow-md">
				<h2 className="text-2xl font-bold text-center mb-6">Login</h2>

				{error && (
					<div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="admin@example.com"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="••••••"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<p className="mt-4 text-center text-sm text-gray-600">
					Don't have an account?{" "}
					<Link href="/register" className="text-blue-600 hover:underline">
						Register
					</Link>
				</p>
			</div>
		</div>
	);
}
