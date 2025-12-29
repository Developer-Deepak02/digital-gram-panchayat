// components/ui/LogoutButton.jsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton({ className, children }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleLogout = async () => {
		await signOut({ callbackUrl: "/login" });
	};

	return (
		<>
			{/* Trigger Button */}
			<button
				onClick={() => setIsOpen(true)}
				className={
					className ||
					"w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition flex items-center gap-2"
				}
			>
				{children ? (
					children
				) : (
					// Default Sidebar Style (Icon + Text)
					<>
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
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
							<polyline points="16 17 21 12 16 7"></polyline>
							<line x1="21" y1="12" x2="9" y2="12"></line>
						</svg>
						Logout
					</>
				)}
			</button>

			{/* Modal Popup */}
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
					<div className="bg-white w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 p-6 scale-100 animate-in zoom-in-95 duration-200">
						<div className="text-center mb-6">
							<div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
									<path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
									<line x1="12" y1="2" x2="12" y2="12"></line>
								</svg>
							</div>
							<h3 className="text-lg font-bold text-slate-900">
								Confirm Logout
							</h3>
							<p className="text-sm text-slate-500 mt-1">
								Are you sure you want to end your session?
							</p>
						</div>
						<div className="flex gap-3">
							<button
								onClick={() => setIsOpen(false)}
								className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition cursor-pointer"
							>
								Cancel
							</button>
							<button
								onClick={handleLogout}
								className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-sm cursor-pointer"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
