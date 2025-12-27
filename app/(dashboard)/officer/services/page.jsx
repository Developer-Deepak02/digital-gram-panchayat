"use client";
import { useState, useEffect } from "react";

export default function ManageServices() {
	const [services, setServices] = useState([]);

	useEffect(() => {
		fetch("/api/services")
			.then((res) => res.json())
			.then((data) => setServices(data));
	}, []);

	return (
		<div>
			[Image of administrative dashboard with charts]
			<h1 className="text-2xl font-bold mb-4">Manage Government Schemes</h1>
			<button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
				+ Create New Service
			</button>
			<div className="grid gap-4">
				{services.map((service) => (
					<div
						key={service._id}
						className="p-4 bg-white shadow rounded flex justify-between"
					>
						<div>
							<h3 className="font-bold">{service.title}</h3>
							<p className="text-sm text-gray-600">{service.description}</p>
						</div>
						<button className="text-red-500">Delete</button>
					</div>
				))}
			</div>
		</div>
	);
}
