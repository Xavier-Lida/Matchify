import { useState } from "react";
import PlayerForm from "./PlayerForm";

export default function PlayerList({ players, teams, onEdit, onDelete }) {
  const [editPlayerId, setEditPlayerId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    teamId: "",
    goals: "",
    photo: "",
  });

  const handleEditClick = (player) => {
    setEditPlayerId(player._id);
    setEditForm({
      name: player.name,
      teamId: player.teamId,
      goals: player.goals,
      photo: player.photo,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(editPlayerId, editForm); // PAS d'événement ici
    setEditPlayerId(null);
  };

  const handleCancelEdit = () => {
    setEditPlayerId(null);
  };

  return (
    <div className="mt-8 min-h-[300px]">
      <ul className="flex flex-col gap-2">
        {players.map((player) =>
          editPlayerId === player._id ? (
            <li
              key={player._id}
              className="px-3 py-2 border-b last:border-b-0 bg-white"
            >
              <PlayerForm
                form={editForm}
                teams={teams}
                onChange={handleEditChange}
                onSubmit={handleEditSubmit}
                onCancel={handleCancelEdit}
                submitLabel="Sauvegarder"
              />
            </li>
          ) : (
            <li
              key={player._id}
              className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm px-3 py-3 border-b last:border-b-0"
            >
              <img
                src={
                  player.photo && player.photo.trim() !== ""
                    ? player.photo
                    : "https://placehold.co/60x60"
                }
                alt={player.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{player.name}</span>
              <span className="text-gray-500 text-sm">
                —{" "}
                {teams.find((t) => t._id === player.teamId)?.name ||
                  "Équipe inconnue"}
              </span>
              <span className="ml-auto text-primary font-bold">
                {player.goals} buts
              </span>
              <button
                className="btn btn-xs btn-outline ml-2"
                onClick={() => handleEditClick(player)}
              >
                Modifier
              </button>
              <button
                className="btn btn-xs btn-error ml-2"
                onClick={() => onDelete(player._id)}
              >
                Supprimer
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
