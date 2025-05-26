"use client";
import TeamCard from "./TeamCard";
import TeamForm from "./TeamForm";
import PlayerForm from "./PlayerForm";
import { useState, useEffect } from "react";
import { cleanPlayers, sendPlayersToDb } from "@/utils/importPlayers";

export default function TeamManager({ team: initialTeam, onTeamDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const [team, setTeam] = useState(initialTeam);

  // Sync local team state with prop changes
  useEffect(() => {
    setTeam(initialTeam);
  }, [initialTeam]);

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
    await fetch(`/api/teams`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team),
    });
    setIsEditing(false);
  };

  // Save players changes
  const handleSavePlayers = async (players) => {
    // Pass team._id to cleanPlayers
    const cleanedPlayers = cleanPlayers(players, team._id);

    try {
      await sendPlayersToDb(cleanedPlayers);
    } catch (err) {
      // Handle error (show notification, etc.)
      console.error("Erreur lors de l'import des joueurs :", err);
    }

    // Update the team with the cleaned players and save team
    const updatedTeam = { ...team, players: cleanedPlayers };
    setTeam(updatedTeam);
    await fetch(`/api/teams`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTeam),
    });
    setShowPlayers(false);
  };

  // Delete team and notify parent
  const handleDelete = async (teamId) => {
    await fetch(`/api/teams?id=${teamId}`, { method: "DELETE" });
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
      {showPlayers && (
        <PlayerForm
          players={team.players || []}
          onSave={handleSavePlayers}
          onClose={() => setShowPlayers(false)}
        />
      )}
    </>
  );
}
