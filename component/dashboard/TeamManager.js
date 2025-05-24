"use client";
import { useState } from "react";
import TeamCard from "./TeamCard";
import TeamForm from "./TeamForm";

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

export default function TeamManager() {
	const [teams, setTeams] = useState(initialTeams);
	const [showAdd, setShowAdd] = useState(false);
	const [editId, setEditId] = useState(null);
	const [form, setForm] = useState({
		name: "",
		division: "",
		points: "",
		logo: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	};

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

	const handleEdit = (team) => {
		setEditId(team.id);
		setForm({
			name: team.name,
			division: team.division,
			points: team.points,
			logo: team.logo,
		});
	};

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

	const handleDelete = (id) => {
		setTeams((prev) => prev.filter((team) => team.id !== id));
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Équipes</h2>
				<button
					className="btn btn-primary"
					onClick={() => {
						setShowAdd(true);
						setEditId(null);
						setForm({ name: "", division: "", points: "", logo: "" });
					}}
				>
					Ajouter Équipe
				</button>
			</div>

			{/* Add Team Modal */}
			{showAdd && (
				<div className="fixed inset-0 bg-base-100 bg-opacity-30 flex items-center justify-center z-50">
					<TeamForm
						form={form}
						onChange={handleChange}
						onSubmit={handleAdd}
						onCancel={() => setShowAdd(false)}
						submitLabel="Ajouter"
					/>
				</div>
			)}

			{/* Teams List */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{teams.map((team) =>
					editId === team.id ? (
						<TeamForm
							key={team.id}
							form={form}
							onChange={handleChange}
							onSubmit={handleSave}
							onCancel={() => setEditId(null)}
							submitLabel="Sauvegarder"
						/>
					) : (
						<TeamCard
							key={team.id}
							team={team}
							onEdit={handleEdit}
							onDelete={handleDelete}
						/>
					)
				)}
			</div>
		</div>
	);
}