"use client";
import TeamCard from "./TeamCard";
import TeamForm from "./TeamForm";
import PlayerForm from "./PlayerForm";
import PlayerList from "./PlayerList";
import { useState, useEffect } from "react";
import { cleanPlayers, updatePlayers } from "@/utils/exportPlayers";
import {
  getPlayersByTeamId,
  updateTeam,
  deleteTeam,
  insertPlayers,
} from "@/utils/api";

export default function TeamManager({ team: initialTeam, onTeamDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const [team, setTeam] = useState(initialTeam);
  const [players, setPlayers] = useState([]);

  // Sync local team state with prop changes
  useEffect(() => {
    setTeam(initialTeam);
  }, [initialTeam]);

  // Fetch players when team._id is available
  useEffect(() => {
    if (team._id) {
      async function fetchPlayers() {
        const players = await getPlayersByTeamId(team._id);
        setPlayers(players);
      }
      fetchPlayers();
    }
  }, [showPlayers, team._id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save team changes to backend
  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    await updateTeam(team);
    setIsEditing(false);
  };

  // Save players changes
  const handleSavePlayers = async (players) => {
    // 1. Update existing players in DB
    await updatePlayers(players, team._id);

    // 2. Clean all players (prepares new players for insertion)
    const cleanedPlayers = cleanPlayers(players, team._id);

    // 3. Insert only new players (those without _id)
    const newPlayers = cleanedPlayers.filter((p) => !p._id);
    if (newPlayers.length > 0) {
      await insertPlayers(newPlayers);
    }

    // 4. Refresh state/UI
    await getPlayersByTeamId(team._id).then(setPlayers);
    setShowPlayers(false);
  };

  // Delete team and notify parent
  const handleDelete = async (teamId) => {
    await deleteTeam(teamId);
    if (onTeamDeleted) onTeamDeleted(teamId);
  };

  if (isEditing) {
    return (
      <TeamForm
        form={team}
        onChange={handleChange}
        onSubmit={handleSave}
        onCancel={() => setIsEditing(false)}
        submitLabel="Sauvegarder"
      />
    );
  }

  return (
    <>
      <TeamCard
        team={team}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
        actions={
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowPlayers(true)}
          >
            Joueurs
          </button>
        }
      />
      <PlayerList players={players} />
      {showPlayers && (
        <PlayerForm
          players={players}
          onSave={handleSavePlayers}
          onClose={() => setShowPlayers(false)}
        />
      )}
    </>
  );
}
