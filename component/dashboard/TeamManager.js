"use client";
import TeamCard from "./TeamCard";
import TeamForm from "./TeamForm";
import PlayerForm from "./PlayerForm";
import PlayerList from "./PlayerList";
import { useState, useEffect } from "react";
import { cleanPlayers, sendPlayersToDb } from "@/utils/exportPlayers";
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
    const cleanedPlayers = cleanPlayers(players, team._id);

    // 1. Update existing players only
    const existingPlayers = cleanedPlayers.filter((p) => p._id);
    if (existingPlayers.length > 0) {
      await sendPlayersToDb(existingPlayers, team._id);
    }

    // 2. Insert only new players
    const newPlayers = cleanedPlayers.filter((p) => !p._id);
    let insertedPlayers = [];
    if (newPlayers.length > 0) {
      insertedPlayers = await insertPlayers(newPlayers);
    }

    // 3. Merge new _ids into cleanedPlayers
    const mergedPlayers = cleanedPlayers.map((player) => {
      if (!player._id) {
        const inserted = insertedPlayers.find(
          (p) => p.number === player.number
        );
        return inserted ? { ...player, _id: inserted._id } : player;
      }
      return player;
    });

    // 4. Update the team object in your backend and state
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
