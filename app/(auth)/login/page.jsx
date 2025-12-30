"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; // Removed getSession as it's no longer needed for redirection
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";
import { toast } from "sonner";

export default function LoginPage() {
	const [info, setInfo] = useState({ email: "", password: "" });
	const [pending, setPending] = useState(false);
	const router = useRouter();

	const handleInput = (e) => {
		setInfo({ ...info, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!info.email || !info.password) {
			toast.error("Please provide all credentials.");
			return;
		}

		try {
			setPending(true);

			const res = await signIn("credentials", {
				email: info.email,
				password: info.password,
				redirect: false,
			});

			if (res.error) {
				toast.error("Invalid Credentials. Please try again.");
				setPending(false);
				return;
			}

			// Success Toast
			toast.success("Login Successful!");

			// --- UPDATED: Redirect everyone to Home Page ("/") ---
			router.replace("/");

		} catch (error) {
			setPending(false);
			toast.error("Something went wrong.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100">
				{/* Header */}
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
							<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
							<polyline points="10 17 15 12 10 7" />
							<line x1="15" y1="12" x2="3" y2="12" />
						</svg>
					</div>
					<h2 className="text-3xl font-bold text-slate-900 tracking-tight">
						Welcome Back
					</h2>
					<p className="mt-2 text-slate-600">
						Sign in to access your dashboard.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Email Address
							</label>
							<input
								name="email"
								type="email"
								required
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition outline-none"
								placeholder="name@example.com"
								onChange={handleInput}
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
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition outline-none"
								placeholder="••••••••"
								onChange={handleInput}
							/>
						</div>
					</div>

					<button
						disabled={pending}
						className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400 disabled:cursor-not-allowed transition-all"
					>
						{pending ? (
							<>
								<Spinner /> <span>Signing in...</span>
							</>
						) : (
							"Sign In"
						)}
					</button>

					<p className="text-center text-sm text-slate-600">
						Don't have an account?{" "}
						<Link
							href="/register"
							className="font-medium text-teal-700 hover:text-teal-600"
						>
							Register here
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
