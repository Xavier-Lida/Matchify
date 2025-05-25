"use client";
import { useState } from "react";
import TeamCard from "./TeamCard";
import TeamForm from "./TeamForm";
import PlayerForm from "./PlayerForm";
import PlayerList from "./PlayerList";
import useCrudManager from "@/hooks/useCrudManager";

export default function TeamManager() {
	// Initial forms
	const teamInitialForm = { name: "", division: "", points: "", logo: "" };
	const playerInitialForm = { name: "", teamId: "", goals: "", photo: "" };

	// Managers
	const teamManager = useCrudManager("/api/teams", teamInitialForm);
	const playerManager = useCrudManager("/api/players", playerInitialForm);

	// Pagination équipe
	const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);

	const teams = teamManager.items;
	const players = playerManager.items;

	// Équipe sélectionnée
	const selectedTeam = teams[selectedTeamIndex] || null;

	// Joueurs de l’équipe sélectionnée
	const filteredPlayers = selectedTeam
		? players.filter((p) => p.teamId === selectedTeam._id)
		: [];

	// Navigation
	const handlePrevTeam = () => {
		setSelectedTeamIndex((i) => (i > 0 ? i - 1 : teams.length - 1));
	};
	const handleNextTeam = () => {
		setSelectedTeamIndex((i) => (i < teams.length - 1 ? i + 1 : 0));
	};

	return (
		<div className="p-6 pt-20">
			{/* Équipes */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Équipes</h2>
				<button
					className="btn btn-primary"
					onClick={() => {
						teamManager.setShowAdd(true);
						teamManager.setEditId(null);
						teamManager.setForm(teamInitialForm);
					}}
				>
					Ajouter Équipe
				</button>
			</div>

			{/* Add Team Modal */}
			{teamManager.showAdd && (
				<div className="fixed inset-0 bg-base-100 bg-opacity-30 flex items-center justify-center z-50">
					<TeamForm
						form={teamManager.form}
						onChange={teamManager.handleChange}
						onSubmit={teamManager.handleAdd}
						onCancel={() => teamManager.setShowAdd(false)}
						submitLabel="Ajouter"
					/>
				</div>
			)}

			{/* Teams List */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{teamManager.items.map((team) =>
					teamManager.editId === team._id ? (
						<TeamForm
							key={team._id}
							form={teamManager.form}
							onChange={teamManager.handleChange}
							onSubmit={teamManager.handleSave}
							onCancel={() => teamManager.setEditId(null)}
							submitLabel="Sauvegarder"
						/>
					) : (
						<TeamCard
							key={team._id}
							team={team}
							onEdit={() => teamManager.handleEdit(team)}
							onDelete={() => teamManager.handleDelete(team._id)}
						/>
					)
				)}
			</div>

			{/* Joueurs */}
			<div className="mt-8">
				<div className="flex justify-between items-center mb-4">
					<button
						className="btn btn-sm"
						onClick={handlePrevTeam}
						disabled={teams.length === 0}
					>
						←
					</button>
					<h3 className="text-xl font-bold flex-1 text-center truncate mx-2">
						{selectedTeam ? selectedTeam.name : "Aucune équipe"}
					</h3>
					<button
						className="btn btn-sm"
						onClick={handleNextTeam}
						disabled={teams.length === 0}
					>
						→
					</button>
					<button
						className="btn btn-primary ml-4"
						onClick={() => {
							playerManager.setShowAdd(true);
							playerManager.setEditId(null);
							playerManager.setForm({
								name: "",
								teamId: selectedTeam ? selectedTeam._id : "",
								goals: "",
								photo: "",
							});
						}}
						disabled={!selectedTeam}
					>
						Ajouter Joueur
					</button>
				</div>
				{/* Add Player Modal */}
				{playerManager.showAdd && (
					<div className="fixed inset-0 bg-base-100 bg-opacity-30 flex items-center justify-center z-50">
						<PlayerForm
							form={playerManager.form}
							teams={teams}
							onChange={playerManager.handleChange}
							onSubmit={playerManager.handleAdd}
							onCancel={() => playerManager.setShowAdd(false)}
							submitLabel="Ajouter"
						/>
					</div>
				)}
				<PlayerList
					players={filteredPlayers}
					teams={teams}
					onEdit={(id, form) => playerManager.handleSave(null, id, form)}
					onDelete={playerManager.handleDelete}
				/>
			</div>
		</div>
	);
}