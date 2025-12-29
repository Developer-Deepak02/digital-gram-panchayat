import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
// Import the new Navbar
import Navbar from "@/components/layouts/Navbar";

export default async function Home() {
	const session = await getServerSession(authOptions);

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			{/* USE THE NEW NAVBAR HERE */}
			<Navbar />

			{/* --- Hero Section --- */}
			<main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
				<div className="max-w-3xl space-y-6">
					<span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded-full text-sm font-medium">
						Digital Governance Portal
					</span>

					<h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
						Simplifying Village Services <br />
						<span className="text-teal-700">For Every Citizen</span>
					</h1>

					<p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
						Apply for government schemes, track your application status, and
						access digital services from the comfort of your home. Transparent,
						efficient, and fast.
					</p>

					<div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
						{session ? (
							<Link
								href={
									session.user.role === "officer"
										? "/officer/services"
										: session.user.role === "staff"
										? "/staff/applications"
										: "/user/services"
								}
								className="bg-teal-700 text-white px-8 py-3.5 rounded-md font-semibold text-lg hover:bg-teal-800 transition shadow-lg shadow-teal-900/10"
							>
								Go to Dashboard
							</Link>
						) : (
							<Link
								href="/register"
								className="bg-teal-700 text-white px-8 py-3.5 rounded-md font-semibold text-lg hover:bg-teal-800 transition shadow-lg shadow-teal-900/10"
							>
								Get Started
							</Link>
						)}

						<Link
							href="/#features"
							className="bg-white text-slate-700 border border-slate-300 px-8 py-3.5 rounded-md font-semibold text-lg hover:bg-slate-50 transition"
						>
							Learn More
						</Link>
					</div>
				</div>
			</main>

			{/* --- Features Grid --- */}
			<section
				id="features"
				className="bg-white border-t border-slate-200 py-16 px-4"
			>
				<div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
					<FeatureCard
						title="Online Applications"
						desc="Apply for certificates and welfare schemes without visiting the office."
						icon={
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />
						}
					/>
					<FeatureCard
						title="Real-time Tracking"
						desc="Check the status of your application instantly via your dashboard."
						icon={
							<>
								<circle cx="12" cy="12" r="10" />
								<polyline points="12 6 12 12 16 14" />
							</>
						}
					/>
					<FeatureCard
						title="Digital Records"
						desc="Secure and transparent record keeping of all village activities."
						icon={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
					/>
				</div>
			</section>

			{/* --- Footer --- */}
			<footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
				<p>&copy; 2025 Digital Gram Panchayat. All rights reserved.</p>
			</footer>
		</div>
	);
}

function FeatureCard({ title, desc, icon }) {
	return (
		<div className="p-6 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition">
			<div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-teal-700 mb-4 shadow-sm">
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
					{icon}
				</svg>
			</div>
			<h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
			<p className="text-slate-600 leading-relaxed">{desc}</p>
		</div>
	);
}
