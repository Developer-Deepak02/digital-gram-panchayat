"use client";

export default function DeleteConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title = "Delete Item",
	message = "Are you sure you want to delete this item? This action cannot be undone.",
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
			<div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
				{/* Header - Red Theme for Destructive Action */}
				<div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
					<div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-sm">
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
							<path d="M3 6h18" />
							<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
							<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
							<line x1="10" y1="11" x2="10" y2="17" />
							<line x1="14" y1="11" x2="14" y2="17" />
						</svg>
					</div>
					<h3 className="text-lg font-bold text-red-900 tracking-tight">
						{title}
					</h3>
				</div>

				{/* Body */}
				<div className="p-6">
					<p className="text-slate-600 text-sm leading-relaxed">{message}</p>
				</div>

				{/* Footer Actions */}
				<div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
					<button
						onClick={onClose}
						className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-lg transition-colors duration-200"
					>
						Cancel
					</button>
					<button
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					>
						Yes, Delete
					</button>
				</div>
			</div>
		</div>
	);
}
