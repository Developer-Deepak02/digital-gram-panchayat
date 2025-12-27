import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
	const session = await getServerSession();

	if (!session) {
		redirect("/login");
	}

	const role = session.user.role; // 'user', 'staff', 'officer'

	return (
		<div className="flex h-screen bg-gray-100">
			{/* Sidebar */}
			<aside className="w-64 bg-white shadow-md">
				<div className="p-4 font-bold text-xl">E-Gram Panchayat</div>
				<nav className="p-4 space-y-2">
					{/* Officer Links */}
					{role === "officer" && (
						<>
							<Link
								href="/officer/services"
								className="block p-2 hover:bg-gray-100"
							>
								Manage Services
							</Link>
							<Link
								href="/officer/applications"
								className="block p-2 hover:bg-gray-100"
							>
								Approvals
							</Link>
						</>
					)}

					{/* Staff Links */}
					{role === "staff" && (
						<Link
							href="/staff/applications"
							className="block p-2 hover:bg-gray-100"
						>
							Process Applications
						</Link>
					)}

					{/* User Links */}
					{role === "user" && (
						<>
							<Link
								href="/user/services"
								className="block p-2 hover:bg-gray-100"
							>
								Browse Services
							</Link>
							<Link
								href="/user/my-apps"
								className="block p-2 hover:bg-gray-100"
							>
								My Applications
							</Link>
							<Link
								href="/user/profile"
								className="block p-2 hover:bg-gray-100"
							>
								My Profile
							</Link>
						</>
					)}

					<div className="mt-10 border-t pt-4">
						<p className="text-sm text-gray-500 mb-2">Logged in as: {role}</p>
						<Link href="/api/auth/signout" className="text-red-500">
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
