"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/ui/LogoutButton";
import { Menu, X } from "lucide-react";

export default function Navbar() {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useState(false);

	// Helper to determine links based on role
	const getNavLinks = () => {
		if (!session) return [];

		const role = session.user.role;

		if (role === "officer") {
			return [
				{ name: "Manage Schemes", href: "/officer/services" },
				{ name: "Approvals", href: "/officer/applications" },
			];
		}
		if (role === "staff") {
			return [{ name: "Applications", href: "/staff/applications" }];
		}
		// Default User Links
		return [
			{ name: "New Schemes", href: "/user/services" },
			{ name: "Track Status", href: "/user/my-apps" },
			{ name: "My Profile", href: "/user/profile" },
		];
	};

	const navLinks = getNavLinks();

	return (
		<nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* 1. LEFT: Logo */}
					<div className="flex-shrink-0 flex items-center">
						<Link href="/" className="flex items-center gap-2 group">
							<div className="w-8 h-8 bg-teal-700 rounded-md flex items-center justify-center text-white transition-transform group-hover:scale-105">
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
									<path d="M3 21h18" />
									<path d="M5 21V7l8-4 8 4v14" />
									<path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
								</svg>
							</div>
							<span className="text-xl font-bold text-teal-800 tracking-tight">
								Digital Gram
							</span>
						</Link>
					</div>

					{/* 2. CENTER: Navigation Links (Desktop Only) */}
					<div className="hidden md:flex items-center justify-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
						{session &&
							navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="text-sm font-medium text-slate-600 hover:text-teal-700 transition"
								>
									{link.name}
								</Link>
							))}
					</div>

					{/* 3. RIGHT: User Profile & Logout (Desktop Only) */}
					<div className="hidden md:flex items-center gap-6">
						{!session ? (
							<>
								<Link
									href="/login"
									className="text-slate-600 font-medium hover:text-teal-700 transition"
								>
									Login
								</Link>
								<Link
									href="/register"
									className="bg-teal-700 text-white px-5 py-2 rounded-md font-medium hover:bg-teal-800 transition shadow-sm hover:shadow-md"
								>
									Register
								</Link>
							</>
						) : (
							<div className="flex items-center gap-4">
								{/* Avatar + Name */}
								<div className="flex items-center gap-3">
									<div className="w-9 h-9 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center font-bold text-sm border border-teal-200">
										{session.user.name.charAt(0).toUpperCase()}
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-bold text-slate-800 leading-none">
											{session.user.name}
										</span>
										<span className="text-[10px] text-slate-500 uppercase font-medium mt-0.5">
											{session.user.role}
										</span>
									</div>
								</div>

								<div className="h-8 w-px bg-slate-200 mx-1"></div>

								{/* Light Red Logout Button with Text & Icon */}
								<LogoutButton className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 border border-red-100">
									<span>Logout</span>
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
										<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
										<polyline points="16 17 21 12 16 7" />
										<line x1="21" y1="12" x2="9" y2="12" />
									</svg>
								</LogoutButton>
							</div>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="flex items-center md:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="text-slate-600 hover:text-teal-700 p-2 focus:outline-none"
						>
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* MOBILE DRAWER */}
			<div
				className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
					isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="px-4 py-4 bg-white border-t border-slate-100 space-y-4 shadow-inner">
					{!session ? (
						<div className="space-y-3">
							<Link
								href="/login"
								className="block w-full text-center py-2.5 text-slate-600 font-medium bg-slate-50 rounded-md hover:bg-slate-100"
							>
								Login
							</Link>
							<Link
								href="/register"
								className="block w-full text-center py-2.5 bg-teal-700 text-white font-medium rounded-md hover:bg-teal-800"
							>
								Register
							</Link>
						</div>
					) : (
						<>
							{/* Mobile Profile Header */}
							<div className="flex items-center gap-3 pb-3 border-b border-slate-100">
								<div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center font-bold text-lg border border-teal-200">
									{session.user.name.charAt(0).toUpperCase()}
								</div>
								<div>
									<p className="text-sm font-bold text-slate-800">
										{session.user.name}
									</p>
									<p className="text-xs text-slate-500 uppercase">
										{session.user.role}
									</p>
								</div>
							</div>

							{/* Mobile Links */}
							<div className="space-y-1">
								{navLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className="block px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-teal-700 rounded-md font-medium transition"
										onClick={() => setIsOpen(false)}
									>
										{link.name}
									</Link>
								))}
							</div>

							{/* Mobile Logout */}
							<div className="pt-2 border-t border-slate-100">
								<LogoutButton className="w-full justify-center bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-md font-medium flex items-center gap-2 transition">
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
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
