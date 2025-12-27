import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
	const session = await getServerSession();

	if (!session) {
		redirect("/login");
	}

	const role = session.user.role;

	return (
		<div className="flex h-screen bg-slate-50">
			{/* Sidebar */}
			<aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
				<div className="p-6 border-b border-slate-100">
					<h1 className="text-xl font-bold text-teal-800">Gram Panchayat</h1>
					<p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
						{role} Portal
					</p>
				</div>

				<nav className="p-4 space-y-1">
					{/* Officer Links */}
					{role === "officer" && (
						<>
							<NavLink href="/officer/services">Manage Services</NavLink>
							<NavLink href="/officer/applications">Approvals</NavLink>
						</>
					)}

					{/* Staff Links */}
					{role === "staff" && (
						<NavLink href="/staff/applications">Process Applications</NavLink>
					)}

					{/* User Links */}
					{role === "user" && (
						<>
							<NavLink href="/user/services">Browse Services</NavLink>
							<NavLink href="/user/my-apps">My Applications</NavLink>
							<NavLink href="/user/profile">My Profile</NavLink>
						</>
					)}

					<div className="mt-8 pt-4 border-t border-slate-100">
						<Link
							href="/api/auth/signout"
							className="block px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
						>
							Logout
						</Link>
					</div>
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-8 overflow-y-auto">{children}</main>
		</div>
	);
}

// Helper component for consistent sidebar links
function NavLink({ href, children }) {
	return (
		<Link
			href={href}
			className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-teal-700 rounded-md transition"
		>
			{children}
		</Link>
	);
}
