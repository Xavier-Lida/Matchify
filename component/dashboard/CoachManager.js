"use client";
import CoachCard from "./CoachCard";
import PlayerForm from "./PlayerForm";
import PlayerList from "./PlayerList";
import GamesheetsMenu from "./GamesheetsMenu";
import { useState, useEffect } from "react";
import { cleanPlayers, sendPlayersToDb } from "@/utils/exportPlayers";
import {
  insertPlayers,
  getPlayersByTeamId,
  fetchGames,
  getTeams,
} from "@/utils/api";

export default function CoachManager({ team: initialTeam }) {
  const [showPlayers, setShowPlayers] = useState(false);
  const [showGamesheets, setShowGamesheets] = useState(false);
  const [team, setTeam] = useState(initialTeam);
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);

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

  // Fetch games and teams when gamesheets menu is opened
  useEffect(() => {
    if (showGamesheets && team._id) {
      async function fetchGamesAndTeams() {
        const [allGames, allTeams] = await Promise.all([
          fetchGames(),
          getTeams(),
        ]);
        const teamGames = allGames.filter(
          (g) => g.teamA === team._id || g.teamB === team._id
        );
        setGames(teamGames);
        setTeams(allTeams);
      }
      fetchGamesAndTeams();
    }
  }, [showGamesheets, team._id]);

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

  return (
    <>
      <CoachCard
        team={team}
        players={() => setShowPlayers(true)}
        print={() => setShowGamesheets(true)}
      />
      <PlayerList players={players} />
      {showPlayers && (
        <PlayerForm
          players={players}
          onSave={handleSavePlayers}
          onClose={() => setShowPlayers(false)}
        />
      )}
      {showGamesheets && (
        <GamesheetsMenu
          team={team}
          games={games}
          teams={teams}
          onClose={() => setShowGamesheets(false)}
        />
      )}
    </>
  );
}
