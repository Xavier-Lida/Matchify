"use client";
import { useEffect, useState } from "react";
import TeamCard from "./TeamCard";
import TeamForm from "./TeamForm";

export default function TeamManager() {
	const [teams, setTeams] = useState([]);
	const [showAdd, setShowAdd] = useState(false);
	const [editId, setEditId] = useState(null);
	const [form, setForm] = useState({
		name: "",
		division: "",
		points: "",
		logo: "",
	});

	// Fetch teams from the API on mount
	useEffect(() => {
		fetch("/api/teams")
			.then((res) => res.json())
			.then(setTeams);
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	};

	const handleAdd = async (e) => {
		e.preventDefault();
		const newTeam = {
			name: form.name,
			division: form.division,
			points: form.points ? Number(form.points) : 0,
			logo: form.logo || "https://placehold.co/60x60",
		};
		await fetch("/api/teams", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newTeam),
		});
		// Refetch teams from the API
		fetch("/api/teams")
			.then((res) => res.json())
			.then(setTeams);
		setForm({ name: "", division: "", points: "", logo: "" });
		setShowAdd(false);
	};

	const handleEdit = (team) => {
		setEditId(team._id);
		setForm({
			name: team.name,
			division: team.division,
			points: team.points,
			logo: team.logo,
		});
	};

	const handleSave = async (e) => {
		e.preventDefault();
		await fetch("/api/teams", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				_id: editId,
				name: form.name,
				division: form.division,
				points: form.points ? Number(form.points) : 0,
				logo: form.logo || "https://placehold.co/60x60",
			}),
		});
		// Refetch teams from the API
		fetch("/api/teams")
			.then((res) => res.json())
			.then(setTeams);
		setEditId(null);
		setForm({ name: "", division: "", points: "", logo: "" });
	};

	const handleDelete = async (id) => {
		await fetch(`/api/teams?id=${id}`, {
			method: "DELETE",
		});
		// Refetch teams from the API
		fetch("/api/teams")
			.then((res) => res.json())
			.then(setTeams);
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
					editId === team._id ? (
						<TeamForm
							key={team._id}
							form={form}
							onChange={handleChange}
							onSubmit={handleSave}
							onCancel={() => setEditId(null)}
							submitLabel="Sauvegarder"
						/>
					) : (
						<TeamCard
							key={team._id}
							team={team}
							onEdit={handleEdit}
							onDelete={() => handleDelete(team._id)}
						/>
					)
				)}
			</div>
		</div>
	);
}