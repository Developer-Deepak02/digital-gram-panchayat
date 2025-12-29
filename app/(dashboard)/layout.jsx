import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/ui/LogoutButton";
import { authOptions } from "@/lib/authOptions";

export default async function DashboardLayout({ children }) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/login");
	}

	const role = session.user.role; // 'user', 'staff', 'officer'

	return (
		<div className="flex h-screen bg-slate-50">
			{/* Sidebar */}
			<aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col hidden md:flex">
				<div className="p-6 border-b border-slate-100">
					<Link href="/" className="flex items-center gap-2 mb-1">
						<div className="w-7 h-7 bg-teal-700 rounded-md flex items-center justify-center text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M3 21h18" />
								<path d="M5 21V7l8-4 8 4v14" />
								<path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
							</svg>
						</div>
						<h1 className="text-lg font-bold text-teal-800 tracking-tight">
							Digital Gram
						</h1>
					</Link>
					<p className="text-xs text-slate-500 uppercase tracking-wider pl-9">
						{role} Portal
					</p>
				</div>

				<nav className="flex-1 p-4 space-y-1 overflow-y-auto">
					{/* OFFICER LINKS */}
					{role === "officer" && (
						<>
							<p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mt-2 mb-1">
								Management
							</p>
							<NavLink href="/officer/services">Manage Schemes</NavLink>
							<NavLink href="/officer/applications">Approvals</NavLink>
						</>
					)}

					{/* STAFF LINKS */}
					{role === "staff" && (
						<>
							<p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mt-2 mb-1">
								Work
							</p>
							<NavLink href="/staff/applications">Process Applications</NavLink>
						</>
					)}

					{/* USER LINKS */}
					{role === "user" && (
						<>
							<p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mt-2 mb-1">
								Services
							</p>
							<NavLink href="/user/services">New Schemes</NavLink>
							<NavLink href="/user/my-apps">Track Status</NavLink>

							<p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-1">
								Settings
							</p>
							<NavLink href="/user/profile">My Profile</NavLink>
						</>
					)}
				</nav>

				{/* Sidebar Footer (High Visibility Logout) */}
				<div className="p-4 border-t border-slate-100">
					<LogoutButton className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-medium py-2.5 px-4 rounded-md hover:bg-red-100 hover:text-red-700 transition shadow-sm border border-red-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<polyline points="16 17 21 12 16 7" />
							<line x1="21" y1="12" x2="9" y2="12" />
						</svg>
						<span>Logout</span>
					</LogoutButton>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 overflow-y-auto">
				<div className="p-8">{children}</div>
			</main>
		</div>
	);
}

// Helper component
function NavLink({ href, children }) {
	return (
		<Link
			href={href}
			className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-teal-700 rounded-md transition flex items-center gap-2"
		>
			{children}
		</Link>
	);
}
