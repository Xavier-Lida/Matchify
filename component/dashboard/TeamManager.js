"use client";

import { useState } from "react";

const initialTeams = [
	{
		id: 1,
		name: "Tigers",
		division: "A",
		points: 32,
		logo: "https://placekitten.com/60/60",
	},
	{
		id: 2,
		name: "Lions",
		division: "B",
		points: 28,
		logo: "https://placekitten.com/61/61",
	},
];

function TeamManager() {
	const [teams, setTeams] = useState(initialTeams);
	const [showAdd, setShowAdd] = useState(false);
	const [editId, setEditId] = useState(null);
	const [form, setForm] = useState({
		name: "",
		division: "",
		points: "",
		logo: "",
	});

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	};

	// Add new team
	const handleAdd = (e) => {
		e.preventDefault();
		setTeams((prev) => [
			...prev,
			{
				id: Date.now(),
				name: form.name,
				division: form.division,
				points: form.points ? Number(form.points) : 0,
				logo: form.logo || "https://placehold.co/60x60",
			},
		]);
		setForm({ name: "", division: "", points: "", logo: "" });
		setShowAdd(false);
	};

	// Edit team
	const handleEdit = (team) => {
		setEditId(team.id);
		setForm({
			name: team.name,
			division: team.division,
			points: team.points,
			logo: team.logo,
		});
	};

	// Save edited team
	const handleSave = (e) => {
		e.preventDefault();
		setTeams((prev) =>
			prev.map((team) =>
				team.id === editId
					? {
							...team,
							name: form.name,
							division: form.division,
							points: form.points ? Number(form.points) : 0,
							logo: form.logo || "https://placehold.co/60x60",
					  }
					: team
			)
		);
		setEditId(null);
		setForm({ name: "", division: "", points: "", logo: "" });
	};

	// Delete team
	const handleDelete = (id) => {
		setTeams((prev) => prev.filter((team) => team.id !== id));
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Teams</h2>
				<button
					className="btn btn-primary"
					onClick={() => {
						setShowAdd(true);
						setEditId(null);
						setForm({ name: "", division: "", points: "", logo: "" });
					}}
				>
					Add Team
				</button>
			</div>

			{/* Add Team Modal */}
			{showAdd && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
					<form
						className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
						onSubmit={handleAdd}
					>
						<h3 className="text-lg font-semibold mb-4">Add Team</h3>
						<div className="mb-3">
							<label className="block mb-1 font-medium">Name</label>
							<input
								name="name"
								value={form.name}
								onChange={handleChange}
								className="input input-bordered w-full"
								required
							/>
						</div>
						<div className="mb-3">
							<label className="block mb-1 font-medium">Division</label>
							<input
								name="division"
								value={form.division}
								onChange={handleChange}
								className="input input-bordered w-full"
								required
							/>
						</div>
						<div className="mb-3">
							<label className="block mb-1 font-medium">Points</label>
							<input
								name="points"
								type="number"
								value={form.points}
								onChange={handleChange}
								className="input input-bordered w-full"
								min={0}
							/>
						</div>
						<div className="mb-4">
							<label className="block mb-1 font-medium">Logo URL</label>
							<input
								name="logo"
								value={form.logo}
								onChange={handleChange}
								className="input input-bordered w-full"
							/>
						</div>
						<div className="flex gap-2">
							<button className="btn btn-primary" type="submit">
								Add
							</button>
							<button
								className="btn btn-ghost"
								type="button"
								onClick={() => setShowAdd(false)}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Teams List */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{teams.map((team) =>
					editId === team.id ? (
						// Edit form inline
						<form
							key={team.id}
							className="card bg-base-100 shadow-md p-4 flex flex-col"
							onSubmit={handleSave}
						>
							<div className="mb-2">
								<label className="block mb-1 font-medium">Name</label>
								<input
									name="name"
									value={form.name}
									onChange={handleChange}
									className="input input-bordered w-full"
									required
								/>
							</div>
							<div className="mb-2">
								<label className="block mb-1 font-medium">Division</label>
								<input
									name="division"
									value={form.division}
									onChange={handleChange}
									className="input input-bordered w-full"
									required
								/>
							</div>
							<div className="mb-2">
								<label className="block mb-1 font-medium">Points</label>
								<input
									name="points"
									type="number"
									value={form.points}
									onChange={handleChange}
									className="input input-bordered w-full"
									min={0}
								/>
							</div>
							<div className="mb-4">
								<label className="block mb-1 font-medium">Logo URL</label>
								<input
									name="logo"
									value={form.logo}
									onChange={handleChange}
									className="input input-bordered w-full"
								/>
							</div>
							<div className="flex gap-2 mt-auto">
								<button className="btn btn-primary" type="submit">
									Save
								</button>
								<button
									className="btn btn-ghost"
									type="button"
									onClick={() => setEditId(null)}
								>
									Cancel
								</button>
							</div>
						</form>
					) : (
						// Team card
						<div
							key={team.id}
							className="card bg-base-100 shadow-md p-4 flex flex-col"
						>
							<div className="flex items-center gap-4 mb-4">
								<img
									src={team.logo}
									alt={team.name}
									className="w-12 h-12 rounded-full object-cover border"
								/>
								<div>
									<h3 className="text-xl font-semibold">{team.name}</h3>
									<div className="text-sm text-gray-500">
										Division: {team.division}
									</div>
									<div className="text-sm text-gray-500">
										Points: {team.points}
									</div>
								</div>
							</div>
							<div className="flex gap-2 mt-auto">
								<button
									className="btn btn-sm btn-outline"
									onClick={() => handleEdit(team)}
								>
									Edit
								</button>
								<button
									className="btn btn-sm btn-error"
									onClick={() => handleDelete(team.id)}
								>
									Delete
								</button>
							</div>
						</div>
					)
				)}
			</div>
		</div>
	);
}

export default TeamManager;