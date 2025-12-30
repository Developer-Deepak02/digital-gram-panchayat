"use client";
import { useState } from "react";

export default function RejectionModal({ isOpen, onClose, onConfirm }) {
	const [reason, setReason] = useState("");

	if (!isOpen) return null;

	const handleSubmit = () => {
		onConfirm(reason || "Rejected by Officer"); // Default text if empty
		setReason(""); // Reset
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
			<div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
				{/* Header */}
				<div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
					<div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
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
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
					</div>
					<h3 className="text-lg font-bold text-red-900">Reject Application</h3>
				</div>

				{/* Body */}
				<div className="p-6">
					<p className="text-slate-600 text-sm mb-4">
						Please provide a reason for rejecting this application. This will be
						visible to the applicant.
					</p>
					<textarea
						autoFocus
						className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm min-h-[100px]"
						placeholder="e.g. Documents are blurry, Income certificate expired..."
						value={reason}
						onChange={(e) => setReason(e.target.value)}
					/>
				</div>

				{/* Footer Actions */}
				<div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
					<button
						onClick={onClose}
						className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-md transition"
					>
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 shadow-sm transition"
					>
						Confirm Rejection
					</button>
				</div>
			</div>
		</div>
	);
}
